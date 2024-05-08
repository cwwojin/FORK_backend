const { Router } = require('express');
const router = Router();
const userController = require('../controllers/userController');
const { body, param, query } = require('express-validator');
const { validatorChecker } = require('../middleware/validator');
const { USER_TYPES } = require("../helper/helper");

router
    .get(
        '/',
        userController.getUsers
    ).get(
        '/:id',
        [
            param('id').exists().notEmpty(),
            validatorChecker,
        ],
        userController.getUserById
    ).post(
        '/insert',
        [
            body('userId').exists().notEmpty().isLength({max: 20}),
            body('password').exists().notEmpty().isLength({min: 6, max: 20}),
            body('userType').exists().toInt().isIn(USER_TYPES),
            body('email').exists().isEmail(),
            body('displayName').exists(),
            validatorChecker,
        ],
        userController.createUser
    )
;


module.exports = router;