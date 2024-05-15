const { Router } = require('express');
const router = Router();
const mapController = require('../controllers/mapController');
const { body, param, query } = require('express-validator');
const { validatorChecker } = require('../middleware/validator');
const { validateMapArea } = require('../helper/helper');

router
    .get(       // GET - get location by id
        '/locate/:id',
        [
            param('id').exists().isInt({min: 1}),
            validatorChecker,
        ],
        mapController.getLocation
    ).get(      // GET - get location by area
        '/',
        [
            body('area').exists().isObject().custom(validateMapArea),
            validatorChecker,
        ],
        mapController.getLocationByArea
    ).get(      // GET - get location by query
        '/search',
        [
            body('name').optional().isString(),
            body('openNow').optional().isBoolean(),
            body('preferences').optional().isArray(),
            validatorChecker,
        ],
        mapController.getLocationByQuery
    )

module.exports = router;