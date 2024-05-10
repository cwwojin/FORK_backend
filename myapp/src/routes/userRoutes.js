const { Router } = require('express');
const router = Router();
const userController = require('../controllers/userController');
const { body, param, query } = require('express-validator');
const { validatorChecker } = require('../middleware/validator');
const { USER_TYPES } = require("../helper/helper");

router
    .get(       // GET : get all users
        '/',
        userController.getUsers
    ).get(      // GET : get user by account_id
        '/:id',
        [
            param('id').exists().isInt({min:1}),
            validatorChecker,
        ],
        userController.getUserById
    ).post(     // POST : create new user
        '/create',
        [
            body('userId').exists().notEmpty().isLength({max: 20}),
            body('password').exists().notEmpty().isLength({min: 6, max: 20}),
            body('userType').exists().toInt().isIn(USER_TYPES),
            body('email').exists().isEmail(),
            body('displayName').exists().notEmpty(),
            validatorChecker,
        ],
        userController.createUser
    ).put(      // PUT : update user - profile
        '/profile/:id',
        [
            param('id').exists().isInt({min:1}),
            body('password').exists().notEmpty().isLength({min: 6, max: 20}),
            body('email').exists().isEmail(),
            body('displayName').exists().notEmpty(),
            validatorChecker,
        ],
        userController.updateUserProfile
    ).delete(   // DELETE : delete a user
        '/delete/:id',
        [
            param('id').exists().isInt({min:1}),
            validatorChecker,
        ],
        userController.deleteUser
    ).get(      // GET : get user preferences
        '/preference/:id',
        [
            param('id').exists().isInt({min:1}),
            validatorChecker,
        ],
        userController.getUserPreference
    ).put(      // PUT : add a user preference
        '/preference/:id',
        [
            param('id').exists().isInt({min:1}),
            body('preferenceId').exists().notEmpty(),
            validatorChecker,
        ],
        userController.addUserPreference
    ).delete(   // DELETE : delete a user preference
        '/preference/:id',
        [
            param('id').exists().isInt({min:1}),
            body('preferenceId').exists().notEmpty(),
            validatorChecker,
        ],
        userController.deleteUserPreference
    ).get(
        '/favorite/:id',
        [
            param('id').exists().isInt({min:1}),
            validatorChecker,
        ],
        userController.getUserFavorite
    ).put(
        '/favorite/:id',
        [
            param('id').exists().isInt({min:1}),
            body('facilityId').exists().notEmpty(),
            validatorChecker,
        ],
        userController.addUserFavorite
    ).delete(
        '/favorite/:id',
        [
            param('id').exists().isInt({min:1}),
            body('facilityId').exists().notEmpty(),
            validatorChecker,
        ],
        userController.deleteUserFavorite
    )
;


module.exports = router;