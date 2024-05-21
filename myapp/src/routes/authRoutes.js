const { Router } = require("express");
const router = Router();
const authController = require("../controllers/authController");
const { body, param, query } = require("express-validator");
const { validatorChecker } = require("../middleware/validator");
const { checkPermission } = require("../middleware/authMiddleware");

router
    .post(
        '/login',
        checkPermission([-1]),  // only guests can login
        [
            body('userId').exists().notEmpty().isLength({max: 20}),
            body('password').exists().notEmpty().isLength({min: 6, max: 20}),
            validatorChecker,
        ],
        authController.loginUser
    )
;

module.exports = router;
