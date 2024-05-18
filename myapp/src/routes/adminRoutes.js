const { Router } = require('express');
const router = Router();
const adminController = require('../controllers/adminController');
const { body, param, query } = require('express-validator');
const { validatorChecker } = require('../middleware/validator');
const { REPORT_TYPES, REPORT_STATUS } = require('../helper/helper');

router
    .get(       // GET : get report by id
        '/reports/:id',
        [
            param('id').exists().isInt({min: 1}),
            validatorChecker,
        ],
        adminController.getReport
    ).get(      // GET : get report by query - author_id, type, status
        '/reports',
        [
            query('user').optional().isInt({min: 1}),
            query('type').optional().isIn(REPORT_TYPES),
            query('status').optional().isIn(REPORT_STATUS),
            validatorChecker,
        ],
        adminController.getReportByQuery
    ).post(     // POST : create a report
        '/reports/upload',
        [
            body('authorId').exists().isInt({min: 1}),
            body('type').exists().isIn(REPORT_TYPES),
            body('content').exists().isString(),
            body('reviewId').optional().isInt({min: 1}),
            validatorChecker,
        ],
        adminController.createReport
    ).delete(   // DELETE : delete a report
        '/reports/delete/:id',
        [
            param('id').exists().isInt({min: 1}),
            validatorChecker,
        ],
        adminController.deleteReport
    ).post(     // POST : handle report and perform follow-up action
        '/reports/handle/:id',
        [
            param('id').exists().isInt({min: 1}),
            body('adminId').exists().isInt({min: 1}),
            body('action').exists().isString(),
            validatorChecker,
        ],
        adminController.handleReport
    )
;

module.exports = router;