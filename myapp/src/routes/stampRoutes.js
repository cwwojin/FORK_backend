const { Router } = require('express');
const { body, param, query } = require('express-validator');

const stampController = require('../controllers/stampController');
const { validatorChecker } = require('../middleware/validator');
const { TRANSACTION_TYPES } = require('../helper/helper');
const { checkPermission } = require('../middleware/authMiddleware');

const router = Router();

router
    .get(
        // GET : get stampbooks by query - userId, facilityId
        '/',
        checkPermission([0, 1, 2]),
        [
            query('user', `optional query field 'user' must be a positive integer`)
                .optional()
                .isInt({ min: 1 }),
            query('facility', `optional query field 'facility' must be a positive integer`)
                .optional()
                .isInt({ min: 1 }),
            validatorChecker,
        ],
        stampController.getStampBook
    )
    .post(
        // POST : create stampbooks by userId, facilityId
        '/create',
        checkPermission([0, 1, 2]),
        [
            body('userId', `body field 'userId' must be a positive integer`)
                .exists()
                .isInt({ min: 1 }),
            body('facilityId', `body field 'facilityId' must be a positive integer`)
                .exists()
                .isInt({ min: 1 }),
            validatorChecker,
        ],
        stampController.createStampBook
    )
    .post(
        // POST : perform a stamp transaction
        '/transaction',
        checkPermission([0, 2]), // Facility user (seller) is the initiator of the transaction
        [
            body('buyerId', `body field 'buyerId' must be a positive integer`)
                .exists()
                .isInt({ min: 1 }),
            body('facilityId', `body field 'facilityId' must be a positive integer`)
                .exists()
                .isInt({ min: 1 }),
            body('sellerId', `body field 'sellerId' must be a postivie integer`)
                .exists()
                .isInt({ min: 1 }),
            body('type', `body field 'type' must be one of ${TRANSACTION_TYPES}`)
                .exists()
                .isIn(TRANSACTION_TYPES),
            body('amount', `body field 'amount' must be non-negative integer`)
                .exists()
                .isInt({ min: 0 }),
            validatorChecker,
        ],
        stampController.stampTransaction
    );

module.exports = router;
