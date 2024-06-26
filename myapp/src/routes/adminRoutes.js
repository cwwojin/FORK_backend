const { Router } = require('express');
const { body, param, query } = require('express-validator');

const adminController = require('../controllers/adminController');
const { validatorChecker } = require('../middleware/validator');
const { REPORT_TYPES, REPORT_STATUS } = require('../helper/helper');
const { checkPermission } = require('../middleware/authMiddleware');

const router = Router();

router
    .get(
        // GET : get report by id
        '/reports/:id',
        checkPermission([0]),
        [
            param('id', `route param 'id' must be a positive integer`).exists().isInt({ min: 1 }),
            validatorChecker,
        ],
        adminController.getReport
    )
    .get(
        // GET : get report by query - author_id, type, status
        '/reports',
        checkPermission([0]),
        [
            query('user', `optional query field 'user' must be a positive integer`)
                .optional()
                .isInt({ min: 1 }),
            query('type', `optional query field 'type' must be one of ${REPORT_TYPES}`)
                .optional()
                .isIn(REPORT_TYPES),
            query('status', `optional query field 'status' must be one of ${REPORT_STATUS}`)
                .optional()
                .isIn(REPORT_STATUS),
            validatorChecker,
        ],
        adminController.getReportByQuery
    )
    .post(
        // POST : create a report
        '/reports/upload',
        checkPermission([0, 1, 2]),
        [
            body('authorId', `body field 'authorId' must be a positive integer`)
                .exists()
                .isInt({ min: 1 }),
            body('type', `body field 'type' must be one of ${REPORT_TYPES}`)
                .exists()
                .isIn(REPORT_TYPES),
            body('content', `body field 'content' must be string`).exists().isString(),
            body('reviewId', `optional body field 'reviewId' must be a positive integer`)
                .optional()
                .isInt({ min: 1 }),
            validatorChecker,
        ],
        adminController.createReport
    )
    .delete(
        // DELETE : delete a report
        '/reports/delete/:id',
        checkPermission([0]),
        [
            param('id', `route param 'id' must be a positive integer`).exists().isInt({ min: 1 }),
            validatorChecker,
        ],
        adminController.deleteReport
    )
    .post(
        // POST : handle report and perform follow-up action
        '/reports/handle/:id',
        checkPermission([0]),
        [
            param('id', `route param 'id' must be a positive integer`).exists().isInt({ min: 1 }),
            body('adminId', `body field 'adminId' must be a positive integer`)
                .exists()
                .isInt({ min: 1 }),
            body('action', `body field 'action' must be a string`).exists().isString(),
            validatorChecker,
        ],
        adminController.handleReport
    )
    .get(
        // GET: get facility registration request by id
        '/facility-requests/:id',
        checkPermission([0, 2]),
        [
            param('id', `route param 'id' must be a positive integer`).exists().isInt({ min: 1 }),
            validatorChecker,
        ],
        adminController.getFacilityRegistrationRequest
    )
    .get(
        // GET: get all facility registration requests
        '/facility-requests',
        checkPermission([0, 2]),
        [
            query('user', `optional query field 'user' must be a positive integer`)
                .optional()
                .isInt({ min: 1 }),
            query('status', `optional query field 'status' must be a positive integer`)
                .optional()
                .isInt({ min: 0, max: 2 }),
            validatorChecker,
        ],
        adminController.getAllFacilityRegistrationRequests
    )
    .post(
        // POST: accept facility registration request requested by specified id
        '/facility-requests/:id/accept',
        checkPermission([0]),
        [
            param('id', `route param 'id' must be a positive integer`).exists().isInt({ min: 1 }),
            body('adminId', `body field 'adminId' must be a positive integer`)
                .exists()
                .isInt({ min: 1 }),
            validatorChecker,
        ],
        adminController.acceptFacilityRegistrationRequest
    )
    .post(
        // POST: decline facility registration request requested by specified id
        '/facility-requests/:id/decline',
        checkPermission([0]),
        [
            param('id', `route param 'id' must be a positive integer`).exists().isInt({ min: 1 }),
            body('adminId', `body field 'adminId' must be a positive integer`)
                .exists()
                .isInt({ min: 1 }),
            validatorChecker,
        ],
        adminController.declineFacilityRegistrationRequest
    )
    .delete(
        // DELETE: delete facility registration request of specified id
        '/facility-requests/:id',
        checkPermission([0, 2]),
        [
            param('id', `route param 'id' must be a positive integer`).exists().isInt({ min: 1 }),
            validatorChecker,
        ],
        adminController.deleteFacilityRegistrationRequest
    );

module.exports = router;
