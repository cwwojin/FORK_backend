const db = require('../models/index');
const { parseBoolean } = require('../helper/helper');
const { removeS3File } = require('../helper/s3Engine');

module.exports = {
    /** get review by review id */
    getReview: async (id) => {
        const query = {
            text: `select r.* from review_with_hashtag r where id = $1`,
            values: [id],
        };
        const result = await db.query(query);
        return result.rows;
    },
    /**
     * get reviews by query
     * - (query) facilityId, userId -> at least one has to be set
     * - (optional) hasImage : reviews that contain an image attachment
     * - (optional) hashtags : reviews that contain at least one of given hashtags
     */
    getReviewByQuery: async (args) => {
        const values = [];
        let baseQuery = `select r.* from review_with_hashtag r where 1=1 `;
        if (args.facility !== undefined) {
            values.push(args.facility);
            baseQuery = baseQuery + `and r.facility_id = $${values.length} `;
        }
        if (args.user !== undefined) {
            values.push(args.user);
            baseQuery = baseQuery + `and r.author_id = $${values.length} `;
        }
        switch (parseBoolean(args.hasImage)) {
            case true:
                baseQuery = baseQuery + `and r.img_uri <> '' `;
                break;
            case false:
                baseQuery = baseQuery + `and r.img_uri = '' `;
                break;
            case undefined:
                break;
        }
        if (Array.isArray(args.hashtags) && args.hashtags.length !== 0) {
            values.push(args.hashtags);
            baseQuery = baseQuery + `and r.hashtag_ids && $${values.length} `;
        }
        const result = await db.query({
            text: baseQuery + `order by r.post_date desc `,
            values: values,
        });
        return result.rows;
    },
    /**
     * Create Review - DB Transaction
     * 1. Insert hashtags that don't exist in DB
     * 2. Results from 1 & hashtags that were in DB -> combine into 'hashtag_ids'
     * 3. Insert all content into "review" table
     * 4. Insert junction table "review_hashtag" entries
     * 5. COMMIT or ROLLBACK transaction if error
     */
    createReview: async (args, clientId) => {
        const client = await db.connect();
        try {
            let result;
            await client.query('BEGIN');

            // new code - make array of {id, name} from args.hashtags (array of names)
            let hashtagArray = [];
            for await (const h of args.hashtags) {
                let { rows } = await db.query({
                    text: `select * from hashtag where name = $1 or (slug <> '' and slug = slugify($1))`,
                    values: [h]
                });
                hashtagArray.push(rows.length ? { id : rows[0].id, name : h} : { id: undefined, name: h});
            }

            const existingHashTags = hashtagArray.filter((e) => !!e['id']);
            const newHashtags = hashtagArray.filter((e) => !e['id']);
            let hashtagIds = existingHashTags.map((e) => e['id']);

            if (newHashtags.length !== 0) {
                const insertTagQuery = `insert into hashtag (name) 
                    values ${newHashtags.map((e) => `('${e['name']}')`).join(`, `)} 
                    returning id`;
                result = await client.query(insertTagQuery);
                hashtagIds = [...hashtagIds, ...result.rows.map((e) => e['id'])];
            }
            result = await client.query({
                text: `insert into review (author_id, facility_id, score, content, img_uri)
                    values ($1, $2, $3, $4, $5) returning id`,
                values: [
                    clientId || args.authorId,
                    args.facilityId,
                    args.score,
                    args.content,
                    args.imageUri,
                ],
            });
            const reviewId = result.rows[0]['id'];
            const insertJunctionQuery = `insert into review_hashtag (review_id, hashtag_id)
                values ${hashtagIds.map((e) => `(${reviewId}, ${e})`).join(`, `)}`;
            await client.query(insertJunctionQuery);
            result = await client.query({
                text: `select * from review_with_hashtag r where id = $1`,
                values: [reviewId],
            });
            await client.query('COMMIT');
            return result.rows;
        } catch (err) {
            await client.query('ROLLBACK');
            throw new Error(err);
        } finally {
            client.release();
        }
    },
    /**
     * Update review
     * - can update content or hashtags
     */
    updateReview: async (id, body) => {
        const client = await db.connect();
        try {
            let result;
            await client.query('BEGIN');

            // new code - make array of {id, name} from args.hashtags (array of names)
            let hashtagArray = [];
            for await (const h of body.hashtags) {
                let { rows } = await db.query({
                    text: `select * from hashtag where name = $1 or (slug <> '' and slug = slugify($1))`,
                    values: [h]
                });
                hashtagArray.push(rows.length ? { id : rows[0].id, name : h} : { id: undefined, name: h});
            }

            const existingHashTags = hashtagArray.filter((e) => !!e['id']);
            const newHashtags = hashtagArray.filter((e) => !e['id']);
            let hashtagIds = existingHashTags.map((e) => e['id']);

            if (newHashtags.length !== 0) {
                const insertTagQuery = `insert into hashtag (name) 
                    values ${newHashtags.map((e) => `('${e['name']}')`).join(`, `)} 
                    returning id`;
                result = await client.query(insertTagQuery);
                hashtagIds = [...hashtagIds, ...result.rows.map((e) => e['id'])];
            }

            result = await client.query({
                text: `update review set content = $1 where id = $2 returning *`,
                values: [body.content, id],
            });
            await client.query({
                text: `delete from review_hashtag where review_id = $1`,
                values: [id],
            });
            const insertJunctionQuery = `insert into review_hashtag (review_id, hashtag_id)
                values ${hashtagIds.map((e) => `(${id}, ${e})`).join(`, `)}`;
            await client.query(insertJunctionQuery);
            result = await client.query({
                text: `select * from review_with_hashtag r where id = $1`,
                values: [id],
            });
            await client.query('COMMIT');
            return result.rows;
        } catch (err) {
            await client.query('ROLLBACK');
            throw new Error(err);
        } finally {
            client.release();
        }
    },
    /** delete a review
     * - if a review with image is deleted, delete the image from S3
     * */
    deleteReview: async (id) => {
        const query = {
            text: `delete from review where id = $1 returning *`,
            values: [id],
        };
        const result = await db.query(query);
        if (result.rows.length !== 0 && result.rows[0].img_uri) {
            await removeS3File(result.rows[0].img_uri);
        }
        return result.rows;
    },
    /** get all hashtags */
    getAllHashtags: async () => {
        const query = {
            text: `select * from hashtag`,
        };
        const result = await db.query(query);
        return result.rows;
    },
    /** get hashtag by id */
    getHashtag: async (id) => {
        const query = {
            text: `select * from hashtag where id = $1`,
            values: [id],
        };
        const result = await db.query(query);
        return result.rows;
    },
    /** get top-N hashtags
     * - get up to top-N hashtags from a certain facility's reviews
     * - if none, return empty array
     */
    getTopHashtags: async (facilityId, limit) => {
        const values = [facilityId];
        let baseQuery = `select h.* from hashtag h 
            join review_hashtag rh on h.id = rh.hashtag_id
            join review r on rh.review_id = r.id
            where r.facility_id = $${values.length}
            group by h.id
            order by count(h.id) desc `;

        // query parameter - limit
        if (limit !== undefined) {
            values.push(limit);
            baseQuery = baseQuery + `limit $${values.length} `;
        }

        const { rows } = await db.query({
            text: baseQuery,
            values: values,
        });
        return rows;
    },
};
