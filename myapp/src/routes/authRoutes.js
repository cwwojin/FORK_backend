const { Router } = require("express");
const router = Router();
const authController = require("../controllers/authController");
const { body, param, query } = require("express-validator");
const { validatorChecker } = require("../middleware/validator");

module.exports = router;
