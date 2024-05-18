const { Router } = require('express');
const router = Router();
const stampController = require('../controllers/stampController');
const { body, param, query } = require('express-validator');
const { validatorChecker } = require('../middleware/validator');
const { TRANSACTION_TYPES } = require('../helper/helper');

router
    .get(       // GET : get stampbooks by query - userId, facilityId
        '/',
        [
            query('user').optional().isInt({min: 1}),
            query('facility').optional().isInt({min: 1}),
            validatorChecker,
        ],
        stampController.getStampBook
    ).post(     // POST : create stampbooks by userId, facilityId
        '/create',
        [
            body('userId').exists().isInt({min: 1}),
            body('facilityId').exists().isInt({min: 1}),
            validatorChecker,
        ],
        stampController.createStampBook
    ).post(     // POST : perform a stamp transaction
        '/transaction',
        [
            body('buyerId').exists().isInt({min: 1}),
            body('facilityId').exists().isInt({min: 1}),
            body('sellerId').exists().isInt({min: 1}),
            body('type').exists().isIn(TRANSACTION_TYPES),
            body('amount').exists().isInt({min: 0}),
            validatorChecker,
        ],
        stampController.stampTransaction
    )
;

module.exports = router;