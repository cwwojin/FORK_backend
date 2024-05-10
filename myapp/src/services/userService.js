const db = require("../models/index");

module.exports = {
    // get all users
    getUsers: async () => {
        const query = {
            text: 'select * from "user" order by id asc',
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
            text: 'insert into "user" (account_id, user_type, password, email, display_name) values ($1, $2, $3, $4, $5) returning *',
            values: [
                info.userId,
                info.userType,
                info.password,
                info.email,
                info.displayName,
            ]
        };
        const result = await db.query(query);
        return result.rows;
    },
    // update user - profile (password, email, display_name)
    updateUserProfile: async (info, id) => {
        const query = {
            text: 'update "user" set password = $1, email = $2, display_name = $3 where id = $4 returning *',
            values: [
                info.password,
                info.email,
                info.displayName,
                id,
            ]
        };
        const result = await db.query(query);
        return result.rows;
    },
    deleteUser: async (id) => {
        const query = {
            text: 'delete from "user" where id = $1',
            values: [id],
        };
        const result = await db.query(query);
        return result;
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
            text: `delete from user_preference where user_id = $1 and preference_id = $2`,
            values: [userId, preferenceId],
        }
        const result = await db.query(query);
        return result;
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
            text: `delete from favorite where user_id = $1 and facility_id = $2`,
            values: [userId, facilityId],
        }
        const result = await db.query(query);
        return result;
    },

}