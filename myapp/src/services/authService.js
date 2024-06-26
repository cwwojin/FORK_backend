const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const {
    validateKAISTMail,
    BCRYPT_SALTROUNDS,
    splitByDelimiter,
    ACCESS_TOKEN_EXPIRESIN,
    REFRESH_TOKEN_EXPIRESIN,
} = require('../helper/helper');
const db = require('../models/index');
const { sendAuthMail, sendPasswordResetMail } = require('../helper/mailSender');
const userService = require('./userService');

const getAccessToken = (payload) => {
    return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRESIN } // TMP : 1 day
    );
};

const validateAccount = async (userId, password) => {
    const { rows } = await db.query({
        text: `select id, account_id, password, user_type from "user" where account_id = $1`,
        values: [userId],
    });
    if (!rows || rows.length === 0) throw { status: 401, message: `Invalid user ID` };
    const pwMatch = await bcrypt.compare(password, rows[0].password);
    if (!pwMatch) throw { status: 401, message: `Invalid password` };

    return rows[0];
};

module.exports = {
    /**
     * login : attempt to log in with account-ID & password
     * SUCCESS -> create token
     */
    loginUser: async (body) => {
        const { userId, password } = body;
        const user = await validateAccount(userId, password);
        const payload = {
            id: user.id,
            accountId: user.account_id,
            userType: user.user_type,
            iat: Math.floor(Date.now() / 1000),
        };

        const token = getAccessToken(payload);
        const refreshToken = await module.exports.getNewRefreshToken(user.id);

        return {
            token: `Bearer ${token}`,
            refreshToken: refreshToken,
            user: payload,
        }; // for Bearer authentication
    },
    /**
     * Send verification mail to KAIST user
     * 1. validate KAIST email
     * 2. send a verification mail containing 6-digit code
     * 3. return the 6-digit code to insert to DB
     */
    sendVerificationMail: async (email) => {
        if (!validateKAISTMail(email)) throw { status: 400, message: 'Not a valid KAIST email' };
        const { authCode } = await sendAuthMail(email);
        return authCode;
    },
    /** re-send verification mail & update pending_kaist_user */
    reSendVerificationMail: async (userId) => {
        const client = await db.connect();
        try {
            await client.query('BEGIN');
            const { rows } = await client.query({
                text: `select * from pending_kaist_user where account_id = $1`,
                values: [userId],
            });
            if (rows.length === 0)
                throw {
                    status: 404,
                    message: `No pending KAIST user found. Please try registration again`,
                };
            const pendingUser = rows[0];

            // send verification mail & get code again
            const authCode = await module.exports.sendVerificationMail(pendingUser.email);
            const hash = await bcrypt.hash(authCode, BCRYPT_SALTROUNDS);

            // update pending-user with the new code hash
            const result = await client.query({
                text: `update pending_kaist_user set auth_code = $1 where id = $2
                    returning email`,
                values: [hash, pendingUser.id],
            });
            if (result.rows.length === 0)
                throw {
                    status: 404,
                    message: `No pending KAIST user found or record was not updated. Please try registration again`,
                };

            await client.query('COMMIT');
            return result.rows;
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    },
    /**
     * Register a new user into the system
     * 1. First, check if user already exists, using account-id
     *      - KAIST user : no duplicate email allowed
     * 1. allowed users : KAIST(1), facility(2)
     * 2. (facility user) call createUser() directly
     * 3. (KAIST user) insert user into a pending-users table, along with verification code
     * - accountId, userType, password, email
     */
    registerNewUser: async (args) => {
        // check duplicate with account-ID
        const users = await userService.getUsers({ accountId: args.userId });
        if (users.length !== 0)
            throw { status: 409, message: `User with the same account-ID already exists` };

        switch (Number(args.userType)) {
            case 1: {
                // check duplicate with userType and email
                const KAISTUsers = await userService.getUsers({
                    type: args.userType,
                    email: args.email,
                });
                if (KAISTUsers.length !== 0)
                    throw {
                        status: 409,
                        message: `A KAIST User with the same email already exists`,
                    };

                const authCode = await module.exports.sendVerificationMail(args.email);
                const pending = await module.exports.insertPendingKAISTUser(args, authCode);
                if (pending.length === 0)
                    throw { status: 404, message: `Couldn't cache KAIST user info` };
                return { type: 1, user: pending[0] };
            }
            case 2: {
                const result = await userService.createUser(args);
                if (result.length === 0)
                    throw { status: 404, message: `Couldn't insert facility user` };
                return { type: 2, user: result[0] };
            }
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
            values: [info.userId, info.userType, info.password, info.email, hash],
        });
        return rows;
    },
    /** verify KAIST email with code
     * - compare code w/ hash value in 'pending_kaist_user'
     * - if successful, insert user into DB & return user info
     */
    verifyKAISTUser: async (args) => {
        const client = await db.connect();
        try {
            await client.query('BEGIN');
            const { rows } = await client.query({
                text: `select * from pending_kaist_user where account_id = $1`,
                values: [args.userId],
            });
            if (rows.length === 0)
                throw {
                    status: 404,
                    message: `No pending KAIST user found. Please try registration again`,
                };
            const pendingUser = rows[0];

            // verify code
            const codeMatch = await bcrypt.compare(args.code, pendingUser.auth_code);
            if (!codeMatch) throw { status: 403, message: `Verification code does not match` };

            // create new KAIST user
            const result = await userService.createUser({
                userId: pendingUser.account_id,
                userType: pendingUser.user_type,
                password: pendingUser.password,
                email: pendingUser.email,
            });

            // delete the pending user
            await client.query({
                text: `delete from pending_kaist_user where id = $1`,
                values: [pendingUser.id],
            });

            await client.query('COMMIT');
            return result;
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    },
    /** sign out - delete my account from FORK system
     * - verify requesting user
     * - use their id to request user deletion
     */
    signOutUser: async (userId) => {
        const result = await userService.deleteUser(userId);
        return result;
    },
    /** request password reset
     * - generate random password
     * - send mail to account email containing the new password
     * - update DB w/ new password
     */
    resetPassword: async (userId) => {
        const client = await db.connect();
        try {
            await client.query('BEGIN');
            const users = await userService.getUsers({ accountId: userId }, true);
            if (users.length === 0)
                throw { status: 404, message: `No user with account id : ${userId}` };

            const { id, email } = users[0];
            const { newPassword } = await sendPasswordResetMail(email);

            const result = await userService.updateUserProfile(
                {
                    password: newPassword,
                    email: email,
                },
                id
            );

            await client.query('COMMIT');
            return result;
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    },

    // Refresh Token Methods

    /** get a user refresh token from DB */
    getUserRefreshToken: async (userId) => {
        const { rows } = await db.query({
            text: `select * from user_refresh_token where user_id = $1`,
            values: [userId],
        });
        return rows;
    },
    /** create & save a refresh-token for a user
     * - create a new refresh token, payload = { id }, exp = 14-days
     * - save the refresh token in DB - user_refresh_token
     *      - insert new row or update existing row
     * - return the token
     */
    getNewRefreshToken: async (userId) => {
        const client = await db.connect();
        try {
            await client.query('BEGIN');

            // generate a refresh token
            const refreshToken = jwt.sign(
                { id: userId, iat: Math.floor(Date.now() / 1000) },
                process.env.JWT_REFRESH_SECRET,
                { expiresIn: REFRESH_TOKEN_EXPIRESIN } // exp : 2 weeks
            );

            // save token in DB
            await client.query({
                text: `insert into user_refresh_token (user_id, refresh_token) values ($1, $2)
                on conflict on constraint user_refresh_token_pkey do update
                set refresh_token = $2`,
                values: [userId, refreshToken],
            });

            await client.query('COMMIT');
            return refreshToken;
        } catch (err) {
            await client.query('ROLLBACK');
            throw {
                status: 409,
                message: `Error during get & save refresh token : ${err.message}`,
            };
        } finally {
            client.release();
        }
    },
    /** grant a new access token via refresh token
     * - POST /api/auth/refresh
     * - (args) access token (Bearer), refresh token
     * - decode AT (without expiredError) -> get the userId (int)
     * - fetch refresh token from DB w/ userId -> if not exists, 401
     * - (1) decode both (input RT, stored RT) -> should have equal payload
     * - (2) string should be equal (inputRT === storedRT)
     *      - 401 if checks fail
     * - return { newAT, existingRT }
     */
    getNewAccessTokenFromRefresh: async (args) => {
        try {
            // decode old AT to get user ID
            const [type, oldAccessToken] = splitByDelimiter(args.accessToken, ' ');
            const { id } = jwt.verify(oldAccessToken, process.env.JWT_SECRET, {
                ignoreExpiration: true,
                // clockTimestamp: Date.now(),
            });

            // get saved RT from DB
            const rows = await module.exports.getUserRefreshToken(id);
            if (!rows.length)
                throw { status: 401, message: `no refresh token in db for user: ${id}` };
            const savedRefreshToken = rows[0].refresh_token;

            // decode both - RT, savedRT -> compare both token & payload
            const inputRTPayload = jwt.verify(args.refreshToken, process.env.JWT_REFRESH_SECRET, {
                // clockTimestamp: Date.now(),
            });
            const savedRTPayload = jwt.verify(savedRefreshToken, process.env.JWT_REFRESH_SECRET, {
                // clockTimestamp: Date.now(),
            });

            const verify =
                args.refreshToken === savedRefreshToken && inputRTPayload.id === savedRTPayload.id;
            if (!verify) throw new Error();

            // make new access token w/ payload
            const user = await userService.getUserById(id);
            const payload = {
                id: user[0].id,
                accountId: user[0].account_id,
                userType: user[0].user_type,
                iat: Math.floor(Date.now() / 1000),
            };
            const newAccessToken = getAccessToken(payload);

            // return new access token & stored refresh token
            return {
                token: `Bearer ${newAccessToken}`,
                refreshToken: savedRefreshToken,
                user: payload,
            };
        } catch (err) {
            throw { status: 401, message: `refresh token validation failed. Please login again` };
        }
    },
    /** logout user - destroy stored refresh token */
    logoutUser: async (userId) => {
        const { rows } = await db.query({
            text: `delete from user_refresh_token where user_id = $1 returning user_id`,
            values: [userId],
        });
        return rows;
    },
};
