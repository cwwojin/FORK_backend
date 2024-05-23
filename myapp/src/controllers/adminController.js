const adminService = require('../services/adminService');

module.exports = {
    /** get report by id */
    getReport: async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const result = await adminService.getReport(id);
            if (result.length !== 0) {
                res.status(200).json({
                    status: 'success',
                    data: result[0],
                });
            } else {
                res.status(404).json({
                    status: 'fail',
                    message: `No report with id: ${id}`,
                });
            }
        } catch (err) {
            next(err);
        }
    },
    /** get report by query - author_id, type, status */
    getReportByQuery: async (req, res, next) => {
        try {
            const result = await adminService.getReportByQuery(req.query);
            res.status(200).json({
                status: 'success',
                data: result,
            });
        } catch (err) {
            next(err);
        }
    },
    /** create a report */
    createReport: async (req, res, next) => {
        try {
            const result = await adminService.createReport(req.body);
            if (result.length !== 0) {
                res.status(201).json({
                    status: 'success',
                    data: result[0],
                });
            } else {
                res.status(404).json({
                    status: 'fail',
                    message: `No records were inserted`,
                });
            }
        } catch (err) {
            next(err);
        }
    },
    /** delete a report by id */
    deleteReport: async (req, res, next) => {
        const id = Number(req.params.id);
        try {
            const result = await adminService.deleteReport(id);
            res.status(200).json({
                status: 'success',
                data: result[0],
            });
        } catch (err) {
            next(err);
        }
    },
    /** handle report - accept a report and perform follow-up action */
    handleReport: async (req, res, next) => {
        const id = Number(req.params.id);
        try {
            const result = await adminService.handleReport(id, req.body);
            res.status(200).json({
                status: 'success',
                data: result,
            });
        } catch (err) {
            next(err);
        }
    },
};
