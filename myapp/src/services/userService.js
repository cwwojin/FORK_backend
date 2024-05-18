const db = require("../models/index");
const { removeS3File } = require("../helper/s3Engine");

module.exports = {
    /** 
     * get user by query 
     * - (args) account_id, user_type
     * */
    getUsers: async (args) => {
        let baseQuery = `select * from "user" where 1=1 `;
        let values = [];
        if(args.accountId !== undefined){
            values.push(args.accountId);
            baseQuery = baseQuery + `and account_id = $${values.length} `;
        }
        if(args.type !== undefined){
            values.push(args.type);
            baseQuery = baseQuery + `and user_type = $${values.length} `;
        }
        const query = {
            text: baseQuery,
            values: values,
        };
        const result = await db.query(query);
        return result.rows;
    },
    // get user by id
    getUserById: async (id) => {
        const query = {
            text: 'select * from "user" where id = $1',
            values: [id],
        };
        const result = await db.query(query);
        return result.rows;
    },
    // create new user
    createUser: async (info) => {
        const query = {
            text: 'insert into "user" (account_id, user_type, password, email) values ($1, $2, $3, $4) returning *',
            values: [
                info.userId,
                info.userType,
                info.password,
                info.email,
            ]
        };
        const result = await db.query(query);
        return result.rows;
    },
    // update user - profile (password, email, display_name)
    updateUserProfile: async (info, id) => {
        const query = {
            text: 'update "user" set password = $1, email = $2 where id = $3 returning *',
            values: [
                info.password,
                info.email,
                id,
            ]
        };
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
        if(result.rows.length !== 0 && result.rows[0].profile_img_uri){
            await removeS3File(result.rows[0].profile_img_uri);
        }
        return result.rows;
    },
    // get user preferences
    getUserPreference: async (id) => {
        const query = {
            text: 'select p.* from user_preference up join "user" u on up.user_id = u.id join preference p on up.preference_id = p.id where up.user_id = $1',
            values: [id],
        }
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
        }
        const result = await db.query(query);
        return result.rows;
    },
    // delete a preference of a user
    deleteUserPreference: async (userId, preferenceId) => {
        const query = {
            text: `delete from user_preference where user_id = $1 and preference_id = $2 returning *`,
            values: [userId, preferenceId],
        }
        const result = await db.query(query);
        return result.rows;
    },
    // get user favorites
    getUserFavorite: async (id) => {
        const query = {
            text: `select f.* from favorite fv 
                join "user" u on fv.user_id = u.id 
                join facility f on fv.facility_id = f.id
                where fv.user_id = $1`,
            values: [id],
        }
        const result = await db.query(query);
        return result.rows;
    },
    // add a favorite to user (if it isn't already added)
    addUserFavorite: async (userId, facilityId) => {
        const query = {
            text: `insert into favorite (user_id, facility_id) values ($1, $2)
                on conflict on constraint favorite_pkey do nothing
                returning *`,
            values: [userId, facilityId],
        }
        const result = await db.query(query);
        return result.rows;
    },
    // delete a favorite of a user
    deleteUserFavorite: async (userId, facilityId) => {
        const query = {
            text: `delete from favorite where user_id = $1 and facility_id = $2 returning *`,
            values: [userId, facilityId],
        }
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
        if(user.length === 0){ 
            throw ({status: 404, message: `No user with id: ${id}`});
        }
        if(user[0].profile_img_uri){
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

}