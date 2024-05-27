const express = require('express');
const { header, validationResult } = require('express-validator');

const { USER_TYPES } = require('../helper/helper');
const userService = require('../services/userService');

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
                next();
            },
        ];
    },
    /** check a requesting user's type which is in headers
     * allow access to the method if user is one of 'allowedTypes'
     */
    checkPermission: (allowedTypes) => {
        return (req, res, next) => {
            const allowed = allowedTypes.includes(Number(req.header('userType')));
            if (!allowed) {
                return res.status(403).json({
                    status: 'fail',
                    message: 'User does not have permission to access this method',
                });
            }
            next();
        };
    },
    /** Identify request user - by header values
     * - only verify if userType is in [0,1,2]
     * - check identity w/ DB (userService)
     */
    identifyUser: () => {
        return async (req, res, next) => {
            if (USER_TYPES.includes(Number(req.header('userType')))) {
                try{
                    const id = Number(req.header('id'));
                    const user = await userService.getUserById(id);
                    if (
                        !(
                            user.length !== 0 &&
                            user[0].account_id === req.header('accountId') &&
                            user[0].user_type === Number(req.header('userType'))
                        )
                    ) {
                        return res.status(401).json({
                            status: 'fail',
                            message: `No user in database with { id: ${req.header('id')}, accountId: ${req.header('accountId')}, userType: ${req.header('userType')} }`,
                        });
                    }
                }catch(err){
                    return res.status(401).json({
                        status: 'fail',
                        message: `User identification failed for { id: ${req.header('id')}, accountId: ${req.header('accountId')}, userType: ${req.header('userType')} }`,
                    })
                }
            }
            next();
        };
    },
};
