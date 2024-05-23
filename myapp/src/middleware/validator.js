/* ~/middleware/validator.js */
const { validationResult } = require('express-validator');

module.exports = {
    validatorChecker: (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 'fail',
                message: `Invalid request : ` + errors.array()[0].msg,
                data: {
                    errors: errors.array(),
                },
            });
        }
        next();
    },
};
