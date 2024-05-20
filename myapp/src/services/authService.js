const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../models/index");

const validateAccount = async (userId, password) => {
    const { rows } = await db.query({
        text: `select id, account_id, password, user_type from "user" where account_id = $1`,
        values: [userId],
    });
    if(!rows || rows.length === 0) throw ({status: 401, message: `Invalid user ID`});

    // const pwMatch = await bcrypt.compare(password, rows[0].password);
    // if(!pwMatch) throw ({status: 401, message: `Invalid password`});

    if(rows[0].password !== password) throw ({status: 401, message: `Invalid password`});

    return rows[0];
};

module.exports = {
    /** 
     * login : attempt to log in with account-ID & password
     * SUCCESS -> create token
     */
    loginUser: async (body) => {
        const { userId, password } = body;
        const payload = await validateAccount(userId, password);
        const token = jwt.sign(
            {
                "id": payload.id,
                "accountId": payload.account_id,
                "userType": payload.user_type,
            }, 
            process.env.JWT_SECRET
        );
        return token;
    },
}