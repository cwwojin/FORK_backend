const { getClientId } = require('../helper/helper');
const stampService = require('../services/stampService');

module.exports = {
    /** get stampbooks by query - user_id, facility_id */
    getStampBook: async (req, res, next) => {
        try {
            const result = await stampService.getStampBook(req.query.user, req.query.facility);
            res.status(200).json({
                status: 'success',
                data: result,
            });
        } catch (err) {
            next(err);
        }
    },
    /** create stampbook with user_id, facility_id */
    createStampBook: async (req, res, next) => {
        try {
            const result = await stampService.createStampBook(req.body);
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
    /** perform a stamp transaction */
    stampTransaction: async (req, res, next) => {
        try {
            const result = await stampService.stampTransaction(req.body, getClientId(req));
            res.status(201).json({
                status: 'success',
                data: result[0],
            });
        } catch (err) {
            next(err);
        }
    },
};
