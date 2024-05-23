const mapService = require('../services/mapService');

module.exports = {
    /** get location by facilty id */
    getLocation: async (req, res, next) => {
        const id = Number(req.params.id);
        try {
            const result = await mapService.getLocation(id);
            if (result.length !== 0) {
                res.status(200).json({
                    status: 'success',
                    data: result[0],
                });
            } else {
                res.status(404).json({
                    status: 'fail',
                    message: `No facility with id: ${id}`,
                });
            }
        } catch (err) {
            next(err);
        }
    },
    /** get location by area (latmin, lngmin, latmax, lngmax) */
    getLocationByArea: async (req, res, next) => {
        try {
            const result = await mapService.getLocationByArea(
                req.query.latMin,
                req.query.lngMin,
                req.query.latMax,
                req.query.lngMax
            );
            res.status(200).json({
                status: 'success',
                data: result,
            });
        } catch (err) {
            next(err);
        }
    },
    /** get location by query (name, openNow, preferences) */
    getLocationByQuery: async (req, res, next) => {
        try {
            const result = await mapService.getLocationByQuery(req.query);
            res.status(200).json({
                status: 'success',
                data: result,
            });
        } catch (err) {
            next(err);
        }
    },
};
