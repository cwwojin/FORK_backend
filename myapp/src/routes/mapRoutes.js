const { Router } = require('express');
const router = Router();
const mapController = require('../controllers/mapController');
const { body, param, query } = require('express-validator');
const { validatorChecker } = require('../middleware/validator');


module.exports = router;