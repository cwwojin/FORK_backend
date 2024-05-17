const { Router } = require('express');
const router = Router();
const mapController = require('../controllers/mapController');
const { body, param, query } = require('express-validator');
const { validatorChecker } = require('../middleware/validator');
const { validateIntArray, validateMapArea } = require('../helper/helper');

router
    .get(       // GET - get location by id
        '/locate/:id',
        [
            param('id', `route param 'id' must be a positive integer`).exists().isInt({min: 1}),
            validatorChecker,
        ],
        mapController.getLocation
    ).get(      // GET - get location by area
        '/',
        [
            body('area', `body field 'area' must be an object with keys {latMin, lngMin, latMax, lngMax}`)
                .exists().isObject().custom(validateMapArea),
            validatorChecker,
        ],
        mapController.getLocationByArea
    ).get(      // GET - get location by query
        '/search',
        [
            body('name', `optional body field 'name' must be a string`).optional().isString(),
            body('openNow', `optional body field 'openNow' must be boolean`).optional().isBoolean(),
            body('preferences', `optional body field 'preferences' must be an integer array`).optional().isArray().custom(validateIntArray),
            validatorChecker,
        ],
        mapController.getLocationByQuery
    )

module.exports = router;