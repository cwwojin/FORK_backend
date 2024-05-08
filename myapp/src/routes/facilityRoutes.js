const { Router } = require('express');
const router = Router();
const facilityController = require('../controllers/facilityController');
const { body, param, query } = require('express-validator');
const { validatorChecker } = require('../middleware/validator');


module.exports = router;