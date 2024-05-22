const { Router } = require("express");
const router = Router();
const authController = require("../controllers/authController");
const { body, param, query } = require("express-validator");
const { validatorChecker } = require("../middleware/validator");
const { checkPermission } = require("../middleware/authMiddleware");

router
    .post(      // POST : login
        '/login',
        checkPermission([-1,0]),
        [
            body('userId').exists().isString(),
            body('password').exists().isString(),
            validatorChecker,
        ],
        authController.loginUser
    )
;

module.exports = router;
