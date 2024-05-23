const authService = require('../services/authService');

module.exports = {
    /** login with userId & password */
    loginUser: async (req, res, next) => {
        try {
            const result = await authService.loginUser(req.body);
            res.status(200).json({
                status: 'success',
                data: {
                    token: result,
                },
                message: `login successful`,
            });
        } catch (err) {
            next(err);
        }
    },
};
