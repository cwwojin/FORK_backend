const mapService = require("../services/mapService");

module.exports = {
    /** get location by facilty id */
    getLocation: async (req,res,next) => {
        const id = Number(req.params.id);
        try{
            const result = await mapService.getLocation(id);
            res.status(200).json(result[0]);
        }catch(err){
            next(err);
        }
    },
    /** get location by area (latmin, lngmin, latmax, lngmax) */
    getLocationByArea: async (req,res,next) => {
        try{
            const result = await mapService.getLocationByArea(
                req.body.area.latMin,
                req.body.area.lngMin,
                req.body.area.latMax,
                req.body.area.lngMax,
            );
            res.status(200).json(result);
        }catch(err){
            next(err);
        }
    },
    /** get location by query (name, openNow, preferences) */
    getLocationByQuery: async (req,res,next) => {
        try{
            const result = await mapService.getLocationByQuery(req.body);
            res.status(200).json(result);
        }catch(err){
            next(err);
        }
    },

}