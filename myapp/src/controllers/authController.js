const { getClientId } = require('../helper/helper');
const authService = require('../services/authService');

module.exports = {
    /** login with userId & password */
    loginUser: async (req, res, next) => {
        try {
            const result = await authService.loginUser(req.body);
            res.status(200).json({
                status: 'success',
                data: result,
                message: `login successful`,
            });
        } catch (err) {
            next(err);
        }
    },
    /**
     * send verification email
     * - this method is called when re-requesting for the verification mail
     * - send the mail to the user with userId, and update 'pending_kaist_user' table
     * */
    reSendVerificationMail: async (req, res, next) => {
        try {
            const result = await authService.reSendVerificationMail(req.body.userId);
            res.status(200).json({
                status: 'success',
                message: `verification code sent to ${result[0].email}`,
            });
        } catch (err) {
            next(err);
        }
    },
    /** register new user
     * - KAIST (1) : insert user into 'pending_kaist_user' table, and wait for verification
     * - facility (2) : create & insert user, returning the inserted row
     */
    registerNewUser: async (req, res, next) => {
        try {
            const result = await authService.registerNewUser(req.body);
            res.status(201).json({
                status: 'success',
                data: result,
            });
        } catch (err) {
            next(err);
        }
    },
    /** verify KAIST email with code. If successful, register user */
    verifyKAISTUser: async (req, res, next) => {
        try {
            const result = await authService.verifyKAISTUser(req.body);
            res.status(201).json({
                status: 'success',
                data: result[0],
            });
        } catch (err) {
            next(err);
        }
    },
    /** sign-out from FORK system
     * - delete my account from DB
     * - rest of my data will be cascade-deleted by DB
     */
    signOutUser: async (req, res, next) => {
        try {
            const result = await authService.signOutUser(getClientId(req));
            res.status(200).json({
                status: 'success',
                data: result[0],
            });
        } catch (err) {
            next(err);
        }
    },
    /** request password reset
     * - generate random password
     * - send mail to account email containing the new password
     * - update DB w/ new password
     */
    resetPassword: async (req, res, next) => {
        try {
            await authService.resetPassword(req.body.userId);
            res.status(201).json({
                status: 'success',
                message: 'Password reset mail sent', // hide email
            });
        } catch (err) {
            next(err);
        }
    },
    /** get a new access token via refresh token */
    getNewAccessTokenFromRefresh: async (req, res, next) => {
        try {
            const result = await authService.getNewAccessTokenFromRefresh({
                accessToken: req.header('Authorization'),
                refreshToken: req.header('Refresh'),
            });
            res.status(200).json({
                status: 'success',
                data: result,
                message: 'access token renewed successfully',
            });
        } catch (err) {
            next(err);
        }
    },
    /** logout user - destroy users refresh token from DB */
    logoutUser: async (req, res, next) => {
        try {
            const result = await authService.logoutUser(getClientId(req));
            res.status(200).json({
                status: 'success',
                message: 'logout successful',
            });
        } catch (err) {
            next(err);
        }
    },
};
