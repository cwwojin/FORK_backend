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
    // get user by accountID
    getUserById: async (id) => {
        const query = {
            text: 'select * from "user" where account_id = $1',
            values: [id],
        }
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
        }
        const result = await db.query(query);
        return result.rows;
    },

}