const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { validateKAISTMail, BCRYPT_SALTROUNDS } = require("../helper/helper");
const db = require("../models/index");
const { sendAuthMail } = require("../helper/mailSender");
const userService = require("./userService");

const validateAccount = async (userId, password) => {
    const { rows } = await db.query({
        text: `select id, account_id, password, user_type from "user" where account_id = $1`,
        values: [userId],
    });
    if(!rows || rows.length === 0) throw ({status: 401, message: `Invalid user ID`});
    const pwMatch = await bcrypt.compare(password, rows[0].password);
    if(!pwMatch) throw ({status: 401, message: `Invalid password`});

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
            process.env.JWT_SECRET,
            { expiresIn: "1h" },    // set expiration time
        );
        return `Bearer ${token}`;   // for Bearer authentication
    },
    /** 
     * Send verification mail to KAIST user
     * 1. validate KAIST email
     * 2. send a verification mail containing 6-digit code
     * 3. return the 6-digit code to insert to DB
     */
    sendVerificationMail: async (email) => {
        if(!validateKAISTMail(email))
            throw ({ status: 400, message: "Not a valid KAIST email" });
        const { authCode } = await sendAuthMail(email);
        return authCode;
    },
    /** re-send verification mail & update pending_kaist_user */
    reSendVerificationMail: async (userId) => {
        try{
            await db.query('BEGIN');
            const { rows } = await db.query({
                text: `select * from pending_kaist_user where account_id = $1`,
                values: [userId],
            });
            if(rows.length === 0)
                throw ({status: 404, message: `No pending KAIST user found. Please try registration again`});
            const pendingUser = rows[0];
    
            // send verification mail & get code again
            const authCode = await module.exports.sendVerificationMail(pendingUser.email);
            const hash = await bcrypt.hash(authCode, BCRYPT_SALTROUNDS);

            // update pending-user with the new code hash
            const result = await db.query({
                text: `update pending_kaist_user set auth_code = $1 where id = $2
                    returning email`,
                values: [hash, pendingUser.id],
            });
            if(result.rows.length === 0)
                throw ({status: 404, message: `No pending KAIST user found or record was not updated. Please try registration again`});

            await db.query('COMMIT');
            return result.rows;
        }catch(err){
            await db.query('ROLLBACK');
            throw err;
        }
    },
    /**
     * Register a new user into the system
     * 1. First, check if user already exists, using account-id
     * 1. allowed users : KAIST(1), facility(2)
     * 2. (facility user) call createUser() directly
     * 3. (KAIST user) insert user into a pending-users table, along with verification code
     * - accountId, userType, password, email
     */
    registerNewUser: async (args) => {
        const users = await userService.getUsers({ accountId: args.userId });
        if(users.length !== 0)
            throw ({status: 409, message: `User with the same account-ID already exists`});

        switch(Number(args.userType)){
            case 1:
                const authCode = await module.exports.sendVerificationMail(args.email);
                const pending = await module.exports.insertPendingKAISTUser(args, authCode);
                if(pending.length === 0)
                    throw ({status: 404, message: `Couldn't cache KAIST user info`});
                return { type: 1, user: pending[0] };
            case 2:
                const result = await userService.createUser(args);
                if(result.length === 0)
                    throw ({status: 404, message: `Couldn't insert facility user`});
                return { type: 2, user: result[0] };
        }
    },
    /** insert KAIST user info into the cache table
     * - "pending_kaist_user" stores user info + bcrypt hash of the verification code
     */
    insertPendingKAISTUser: async (info, authCode) => {
        const hash = await bcrypt.hash(authCode, BCRYPT_SALTROUNDS);
        const { rows } = await db.query({
            text: `insert into pending_kaist_user (account_id, user_type, password, email, auth_code)
                values ($1, $2, $3, $4, $5)
                on conflict on constraint pending_kaist_user_account_id_key do update
                set password = $3, email = $4, auth_code = $5
                returning id, account_id`,
            values: [
                info.userId, 
                info.userType,
                info.password,
                info.email,
                hash,
            ],
        });
        return rows;
    },
    /** verify KAIST email with code
     * - compare code w/ hash value in 'pending_kaist_user'
     * - if successful, insert user into DB & return user info
     */
    verifyKAISTUser: async (args) => {
        try{
            await db.query('BEGIN');
            const { rows } = await db.query({
                text: `select * from pending_kaist_user where account_id = $1`,
                values: [args.userId],
            });
            if(rows.length === 0)
                throw ({status: 404, message: `No pending KAIST user found. Please try registration again`});
            const pendingUser = rows[0];
    
            // verify code
            const codeMatch = await bcrypt.compare(args.code, pendingUser.auth_code);
            if(!codeMatch)
                throw ({status: 403, message: `Verification code does not match`});
    
            // create new KAIST user
            const result = await userService.createUser({
                userId: pendingUser.account_id,
                userType: pendingUser.user_type,
                password: pendingUser.password,
                email: pendingUser.email,
            });

            // delete the pending user
            await db.query({
                text: `delete from pending_kaist_user where id = $1`,
                values: [pendingUser.id],
            });
    
            await db.query('COMMIT');
            return result;
        }catch(err){
            await db.query('ROLLBACK');
            throw err;
        }
    },

}