const { header, validationResult } = require('express-validator');

const { USER_TYPES } = require('../helper/helper');

const guest_user_types = [-1, ...USER_TYPES];

module.exports = {
    /** check if request has 'userType' header - will succeed if its coming from API-GW */
    checkUserTypeHeader: () => {
        return [
            header('userType').exists().toInt().isIn(guest_user_types),
            header('id').optional().toInt().isInt({ min: 1 }),
            header('accountId').optional().isString(),
            (req, res, next) => {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    res.status(401).json({
                        status: 'fail',
                        message: `One or more invalid userType, id, accountId headers. Check authorization`,
                    });
                }
            },
        ];
    },
    /** check a requesting user's type which is in headers
     * allow access to the method if user is one of 'allowedTypes'
     */
    checkPermission: (allowedTypes) => {
        return (req, res, next) => {
            const allowed = allowedTypes.includes(Number(req.header('userType')));
            // const allowed = allowedTypes.includes(req.header('userType'));
            if (!allowed) {
                return res.status(403).json({
                    status: 'fail',
                    message: 'User does not have permission to access this method',
                });
            }
            next();
        };
    },
};
