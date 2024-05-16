const db = require('../models/index');
const { parseBoolean } = require('../helper/helper');

module.exports = {
    /** get review by review id */
    getReview: async (id) => {
        const query = {
            text: `select r.* from review_with_hashtag r where id = $1`,
            values: [id]
        }
        const result = await db.query(query);
        return result.rows;
    },
    /** 
     * get reviews by query
     * - (query) facilityId, userId -> at least one has to be set
     * - (optional) hasImage : reviews that contain an image attachment
     * - (optional) hashtags : reviews that contain at least one of given hashtags
     */
    getReviewByQuery: async (facilityId, userId, body) => {
        let values = [];
        let baseQuery = `select r.* from review_with_hashtag r where 1=1 `
        if(facilityId !== undefined){
            values.push(facilityId);
            baseQuery = baseQuery + `and r.facility_id = $${values.length} `;
        }
        if(userId !== undefined){
            values.push(userId);
            baseQuery = baseQuery + `and r.author_id = $${values.length} `;
        }
        switch(parseBoolean(body.hasImage)){
            case true:
                baseQuery = baseQuery + `and r.img_uri <> '' `;
                break;
            case false:
                baseQuery = baseQuery + `and r.img_uri = '' `;
                break;
            case undefined:
                break;
        }
        if(body.hashtags){
            values.push(body.hashtags)
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
    createReview: async (args) => {
        try {
            const existingHashTags = args.hashtags.filter((e) => !!e['id']);
            const newHashtags = args.hashtags.filter((e) => !e['id']);
            const insertTagQuery = `insert into hashtag (name) 
                values ${newHashtags.map((e) => `('${e['name']}')`).join(`, `)} 
                returning id`;
            await db.query('BEGIN');
            let result = await db.query(insertTagQuery);
            const hashtagIds = [...existingHashTags.map((e) => e['id']), ...result.rows.map((e) => e['id'])];
            result = await db.query({
                text: `insert into review (author_id, facility_id, score, content, img_uri)
                    values ($1, $2, $3, $4, $5) returning id`,
                values: [
                    args.authorId, 
                    args.facilityId, 
                    args.score, 
                    args.content, 
                    args.imageUri, 
                ]
            });
            const reviewId = result.rows[0]['id'];
            const insertJunctionQuery = `insert into review_hashtag (review_id, hashtag_id)
                values ${hashtagIds.map((e) => `(${reviewId}, ${e})`).join(`, `)}`;
            await db.query(insertJunctionQuery);
            result = await db.query({
                text: `select * from review_with_hashtag r where id = $1`,
                values: [reviewId],
            });
            await db.query('COMMIT');
            return result.rows;
        }catch(err){
            await db.query('ROLLBACK');
            throw new Error(err);
        }
    },
    /** 
     * Update review
     */
    updateReview: async (id, body) => {
        try{
            const existingHashTags = body.hashtags.filter((e) => !!e['id']);
            const newHashtags = body.hashtags.filter((e) => !e['id']);
            const insertTagQuery = `insert into hashtag (name) 
                values ${newHashtags.map((e) => `('${e['name']}')`).join(`, `)} 
                returning id`;
            await db.query('BEGIN');
            let result = await db.query(insertTagQuery);
            const hashtagIds = [...existingHashTags.map((e) => e['id']), ...result.rows.map((e) => e['id'])];
            result = await db.query({
                text: `update review set content = $1 where id = $2 returning *`,
                values: [body.content, id],
            });
            await db.query({
                text: `delete from review_hashtag where review_id = $1`,
                values: [id],
            });
            const insertJunctionQuery = `insert into review_hashtag (review_id, hashtag_id)
                values ${hashtagIds.map((e) => `(${id}, ${e})`).join(`, `)}`;
            await db.query(insertJunctionQuery);
            result = await db.query({
                text: `select * from review_with_hashtag r where id = $1`,
                values: [id],
            });
            await db.query('COMMIT');
            return result.rows;
        }catch(err){
            await db.query('ROLLBACK');
            throw new Error(err);
        }
    },
    /** delete a review */
    deleteReview: async (id) => {
        const query = {
            text: `delete from review where id = $1 returning *`,
            values: [id]
        }
        const result = await db.query(query);
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

}