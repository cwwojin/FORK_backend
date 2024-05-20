const { Router } = require("express");
const router = Router();
const authController = require("../controllers/authController");
const { body, param, query } = require("express-validator");
const { validatorChecker } = require("../middleware/validator");

router
    .post(      // POST : login
        '/login',
        [
            body('userId').exists().isString(),
            body('password').exists().isString(),
            validatorChecker,
        ],
        authController.loginUser
    )
;

module.exports = router;
