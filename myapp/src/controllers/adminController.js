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
    /** get facility registration request - get facility registration request by id and its content */
    getFacilityRegistrationRequest: async (req, res, next) => {
        try {
            const result = await adminService.getFacilityRegistrationRequest(Number(req.params.id));
            if (result) {
                res.status(200).json({
                    status: 'success',
                    data: result,
                });
            } else {
                res.status(404).json({
                    status: 'fail',
                    message: `No request with id: ${req.params.id}`,
                });
            }
        } catch (err) {
            next(err);
        }
    },
    /** get all facility registration rquests - get all facility registration requests */
    getAllFacilityRegistrationRequests: async (req, res, next) => {
        try {
            const { user, status } = req.query; // Read query parameters
            const result = await adminService.getAllFacilityRegistrationRequests({
                authorId: user ? Number(user) : undefined,
                status: status ? Number(status) : undefined,
            });
            res.status(200).json({
                status: 'success',
                data: result,
            });
        } catch (err) {
            next(err);
        }
    },
    /** set status column of facility registration request by id to be "accepted" */
    acceptFacilityRegistrationRequest: async (req, res, next) => {
        try {
            const result = await adminService.acceptFacilityRegistrationRequest(
                Number(req.params.id),
                req.body.adminId
            );
            res.status(200).json({
                status: 'success',
                data: result,
            });
        } catch (err) {
            next(err);
        }
    },
    /** set status column of facility registration request by id to be "rejected" */
    declineFacilityRegistrationRequest: async (req, res, next) => {
        try {
            const result = await adminService.declineFacilityRegistrationRequest(
                Number(req.params.id),
                req.body.adminId
            );
            res.status(200).json({
                status: 'success',
                data: result,
            });
        } catch (err) {
            next(err);
        }
    },
    /** delete facility registration request by id*/
    deleteFacilityRegistrationRequest: async (req, res, next) => {
        try {
            const result = await adminService.deleteFacilityRegistrationRequest(
                Number(req.params.id)
            );
            res.status(200).json({
                status: 'success',
                data: result,
            });
        } catch (err) {
            next(err);
        }
    },
};
