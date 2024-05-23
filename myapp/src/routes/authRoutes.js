const { Router } = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/authController');
const { validatorChecker } = require('../middleware/validator');
const { checkPermission } = require('../middleware/authMiddleware');

const router = Router();

router.post(
    // POST : login
    '/login',
    checkPermission([-1]), // only guests can login
    [body('userId').exists().isString(), body('password').exists().isString(), validatorChecker],
    authController.loginUser
);

module.exports = router;
