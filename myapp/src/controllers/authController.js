const authService = require('../services/authService');

module.exports = {
    // login
    loginUser: async (req, res, next) => {
        try {
            const result = await authService.loginUser(req.body);
            res.status(200).json({
                message: 'Login successful',
                token: result.token,
                userId: result.userId,
                userType: result.userType,
                id: result.id,
            });
        } catch (err) {
            res.status(401).json({ message: err.message });
        }
    },
};
