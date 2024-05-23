const { Router } = require('express');
const router = Router();
const authController = require('../controllers/authController');
const { body, param, query } = require('express-validator');
const { validatorChecker } = require('../middleware/validator');
const { checkPermission } = require('../middleware/authMiddleware');
const { USER_TYPES, validateUserId, validatePassword } = require('../helper/helper');

router
    .post(
        // POST : login
        '/login',
        checkPermission([-1, 0]),
        [
            body('userId').exists().isString(),
            body('password').exists().isString(),
            validatorChecker,
        ],
        authController.loginUser
    )
    .post(
        // POST : request email verification for KAIST user
        '/resend-verification-mail',
        checkPermission([-1, 0]),
        [
            body('userId', `body field 'userId' should be string`).exists().isString(),
            validatorChecker,
        ],
        authController.reSendVerificationMail
    )
    .post(
        // POST : register new KAIST or facility user. KAIST user will require verification
        '/register',
        checkPermission([-1, 0]),
        [
            body('userId', `body field 'userId' violates account id constraints`)
                .exists()
                .isString()
                .isLength({ min: 6, max: 20 })
                .custom(validateUserId),
            body('password', `body field 'password' violates account password constraints`)
                .exists()
                .isString()
                .isLength({ min: 6, max: 20 })
                .custom(validatePassword),
            body('userType', `body field 'userType' must be one of ${USER_TYPES}`)
                .exists()
                .isIn(USER_TYPES),
            body('email', `body field 'email' must be a valid email`).exists().isEmail(),
            validatorChecker,
        ],
        authController.registerNewUser
    )
    .post(
        // POST : verify KAIST user email & register
        '/verify-kaist',
        checkPermission([-1, 0]),
        [
            body('userId', `body field 'userId' should be string`).exists().isString(),
            body('code', `body field 'code' should be string`).exists().isString(),
            validatorChecker,
        ],
        authController.verifyKAISTUser
    );

module.exports = router;
