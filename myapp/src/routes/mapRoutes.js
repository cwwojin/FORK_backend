const { Router } = require('express');
const { param, query } = require('express-validator');

const mapController = require('../controllers/mapController');
const { validatorChecker } = require('../middleware/validator');
const { validateIntArray } = require('../helper/helper');

const router = Router();

router
    .get(
        // GET - get location by id
        '/locate/:id',
        [
            param('id', `route param 'id' must be a positive integer`).exists().isInt({ min: 1 }),
            validatorChecker,
        ],
        mapController.getLocation
    )
    .get(
        // GET - get location by area
        '/',
        [
            query('latMin', `query field 'latMin' should be float`).exists().isFloat(),
            query('lngMin', `query field 'lngMin' should be float`).exists().isFloat(),
            query('latMax', `query field 'latMax' should be float`).exists().isFloat(),
            query('lngMax', `query field 'lngMax' should be float`).exists().isFloat(),
            validatorChecker,
        ],
        mapController.getLocationByArea
    )
    .get(
        // GET - get location by query
        '/search',
        [
            query('name', `optional query field 'name' must be a string`).optional().isString(),
            query('openNow', `optional query field 'openNow' must be boolean`)
                .optional()
                .isBoolean(),
            query('preferences', `optional query field 'preferences' must be an integer array`)
                .optional()
                .isString()
                .customSanitizer((e) => e.split(',').map((e) => Number(e)))
                .custom(validateIntArray),
            validatorChecker,
        ],
        mapController.getLocationByQuery
    );

module.exports = router;
