const bcrypt = require('bcrypt');

const db = require('../models/index');
const { BCRYPT_SALTROUNDS } = require('../helper/helper');
const { removeS3File } = require('../helper/s3Engine');
const facilityService = require('./facilityService');

module.exports = {
    /**
     * get user by query
     * - (args) account_id, user_type
     * */
    getUsers: async (args, getEmail) => {
        let baseQuery;
        if (getEmail) {
            baseQuery = `select id, account_id, user_type, email, profile_img_uri, register_date from "user" where 1=1 `;
        } else {
            baseQuery = `select id, account_id, user_type, profile_img_uri, register_date from "user" where 1=1 `;
        }
        const values = [];
        if (args.accountId !== undefined) {
            values.push(args.accountId);
            baseQuery = baseQuery + `and account_id = $${values.length} `;
        }
        if (args.type !== undefined) {
            values.push(args.type);
            baseQuery = baseQuery + `and user_type = $${values.length} `;
        }
        if (args.email !== undefined) {
            values.push(args.email);
            baseQuery = baseQuery + `and email = $${values.length} `;
        }
        const query = {
            text: baseQuery,
            values: values,
        };
        const result = await db.query(query);
        return result.rows;
    },
    // get user by id
    getUserById: async (id, clientId) => {
        let baseQuery;
        if (Number(id) === Number(clientId)) {
            baseQuery =
                'select id, account_id, user_type, email, profile_img_uri, register_date from "user" where id = $1';
        } else {
            baseQuery =
                'select id, account_id, user_type, profile_img_uri, register_date from "user" where id = $1';
        }
        const query = {
            text: baseQuery,
            values: [id],
        };
        const result = await db.query(query);
        return result.rows;
    },
    // create new user
    createUser: async (info) => {
        const passwordHash = await bcrypt.hash(info.password, BCRYPT_SALTROUNDS);
        const query = {
            text: 'insert into "user" (account_id, user_type, password, email) values ($1, $2, $3, $4) returning *',
            values: [info.userId, info.userType, passwordHash, info.email],
        };
        const result = await db.query(query);
        return result.rows;
    },
    /** update user - profile (password, email, display_name) 
     * - optionally update user preferences from input list
    */
    updateUserProfile: async (info, id) => {
        const passwordHash = await bcrypt.hash(info.password, BCRYPT_SALTROUNDS);
        const query = {
            text: 'update "user" set password = $1, email = $2 where id = $3 returning *',
            values: [passwordHash, info.email, id],
        };
        
        // update preferences if given
        if (info.preferences)
            await module.exports.setUserPreferences(id, info.preferences);

        const result = await db.query(query);
        return result.rows;
    },
    // delete user
    deleteUser: async (id) => {
        const query = {
            text: 'delete from "user" where id = $1 returning *',
            values: [id],
        };
        const result = await db.query(query);
        if (result.rows.length !== 0 && result.rows[0].profile_img_uri) {
            await removeS3File(result.rows[0].profile_img_uri);
        }
        return result.rows;
    },
    // get user preferences
    getUserPreference: async (id) => {
        const query = {
            text: 'select p.* from user_preference up join "user" u on up.user_id = u.id join preference p on up.preference_id = p.id where up.user_id = $1',
            values: [id],
        };
        const result = await db.query(query);
        return result.rows;
    },
    // add a preference to user (if it isn't already added)
    addUserPreference: async (userId, preferenceId) => {
        const query = {
            text: `insert into user_preference (user_id, preference_id) values ($1, $2)
                on conflict on constraint user_preference_pkey do nothing
                returning *`,
            values: [userId, preferenceId],
        };
        const result = await db.query(query);
        return result.rows;
    },
    // delete a preference of a user
    deleteUserPreference: async (userId, preferenceId) => {
        const query = {
            text: `delete from user_preference where user_id = $1 and preference_id = $2 returning *`,
            values: [userId, preferenceId],
        };
        const result = await db.query(query);
        return result.rows;
    },
    /** set user preferences - in batch
     * - (args) array of preference-IDs
     * - delete all preferences -> insert all from input
     */
    setUserPreferences: async (userId, preferences) => {
        const client = await db.connect();
        try {
            await client.query('BEGIN');

            // delete all preferences
            await client.query({
                text: `delete from user_preference where user_id = $1`,
                values: [userId],
            });

            // insert all preferences from input (if nonempty)
            let result = [];
            if (preferences.length) {
                let baseQuery = `insert into user_preference (user_id, preference_id) values `;
                baseQuery = baseQuery + preferences.map((e, idx) => `($1, $${idx + 2})`).join(', ');
                const { rows } = await client.query({
                    text: baseQuery + ` returning *`,
                    values: [userId, ...preferences],
                });
                result = rows;
            }

            await client.query('COMMIT');
            return result;
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    },
    /** get user favorites*/
    getUserFavorite: async (id) => {
        const query = {
            text: `select f.* from favorite fv 
                join "user" u on fv.user_id = u.id 
                join facility_detailed f on fv.facility_id = f.id
                where fv.user_id = $1`,
            values: [id],
        };
        const result = await db.query(query);
        return result.rows;
    },
    /** check if a facility is in user's favorites. return boolean */
    isUserFavorite: async (userId, facilityId) => {
        const { rows } = await db.query({
            text: `select * from favorite fv
                where user_id = $1 and facility_id = $2`,
            values: [userId, facilityId],
        });
        const result = rows.length !== 0;
        return result;
    },
    // add a favorite to user (if it isn't already added)
    addUserFavorite: async (userId, facilityId) => {
        const query = {
            text: `insert into favorite (user_id, facility_id) values ($1, $2)
                on conflict on constraint favorite_pkey do nothing
                returning *`,
            values: [userId, facilityId],
        };
        const result = await db.query(query);
        return result.rows;
    },
    // delete a favorite of a user
    deleteUserFavorite: async (userId, facilityId) => {
        const query = {
            text: `delete from favorite where user_id = $1 and facility_id = $2 returning *`,
            values: [userId, facilityId],
        };
        const result = await db.query(query);
        return result.rows;
    },
    // Get all posts of favorite facilities of a user, ordered by updated dates
    getFavoriteFacilityPosts: async (userId) => {
        const query = {
            text: `
                SELECT p.*
                FROM post p
                JOIN favorite f ON p.facility_id = f.facility_id
                WHERE f.user_id = $1
                ORDER BY p.updated_at DESC
            `,
            values: [userId],
        };
        const result = await db.query(query);
        return result.rows;
    },
    /**
     * upload / update a user profile image
     * 1. if user already has a profile image, delete file from S3
     * 2. update user 'profile_img_uri'
     * */
    uploadUserProfileImage: async (id, imageUri) => {
        const user = await module.exports.getUserById(id);
        if (user.length === 0) {
            throw { status: 404, message: `No user with id: ${id}` };
        }
        if (user[0].profile_img_uri) {
            await removeS3File(user[0].profile_img_uri);
        }
        const result = await db.query({
            text: `update "user" set profile_img_uri = $1 where id = $2 returning *`,
            values: [imageUri, id],
        });
        return result.rows;
    },
    /** delete a user profile image, setting 'profile_img_uri' = '' */
    deleteUserProfileImage: async (id) => {
        const result = await module.exports.uploadUserProfileImage(id, '');
        return result;
    },
    /** get all preferences - used for both user & facility */
    getAllPreferences: async () => {
        const query = {
            text: `select * from preference`,
        };
        const result = await db.query(query);
        return result.rows;
    },
    /** get preference by id*/
    getPreference: async (id) => {
        const query = {
            text: `select * from preference where id = $1`,
            values: [id],
        };
        const result = await db.query(query);
        return result.rows;
    },
    // Get my facilities with id
    getMyFacility: async (id) => {
        const query = {
            text: `SELECT f.* FROM facility_detailed f 
                 JOIN manages m ON f.id = m.facility_id 
                 WHERE m.user_id = $1`,
            values: [id],
        };
        const result = await db.query(query);
        return result.rows;
    },

    /** Update my facility by facility-ID
     * 1. validate facility ownership
     * 2. call facilityService to update w/ body contents
     */
    updateMyFacility: async (userId, facilityId, data) => {
        const myFacility = await module.exports.getMyFacility(userId);
        if (!myFacility.map((e) => e.id).includes(Number(facilityId))) {
            // NOT my facility -> deny request
            throw {
                status: 404,
                message: `Facility not found or is not managed by the user`,
            };
        }
        await facilityService.updateFacility(facilityId, data);
        if (data.preferences !== undefined && data.preferences.length !== 0) {
            const currPreferences = await facilityService.getPreferencesByFacilityId(facilityId);
            // prune all
            for await (const preference of currPreferences.map((e) => e.id)) {
                await facilityService.deletePreferenceFromFacility(facilityId, preference);
            }
            // add all
            for await (const preference of data.preferences) {
                await facilityService.addPreferenceToFacility(facilityId, preference);
            }
        }
        if (data.stampRuleset !== undefined) {
            await facilityService.createStampRuleset(facilityId, data.stampRuleset);
        }
        // get result - updated facility_detailed
        const result = await facilityService.getFacilityById(facilityId);
        return result;
    },

    /** Delete facility relationship (not the facility) */
    deleteFacilityRelationship: async (id, facilityId) => {
        const query = {
            text: `DELETE FROM manages WHERE user_id = $1 AND facility_id = $2 RETURNING *`,
            values: [id, facilityId],
        };
        const result = await db.query(query);
        return result.rows[0];
    },

    /** Delete the facility from the system
     * 1. validate facility ownership
     * 2. call facilityService to delete the facility (rest will be handled by cascade deletes)
     */
    deleteMyfacility: async (userId, facilityId) => {
        // validate facility ownership
        const myFacility = await module.exports.getMyFacility(userId);
        if (!myFacility.map((e) => e.id).includes(Number(facilityId))) {
            throw {
                status: 404,
                message: `Facility not found or is not managed by the user`,
            };
        }

        const result = await facilityService.deleteFacility(facilityId);
        return result;
    },
};
