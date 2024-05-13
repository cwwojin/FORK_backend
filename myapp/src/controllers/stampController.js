const stampService = require('../services/stampService');

module.exports = {
    /** get stampbooks by query - user_id, facility_id */
    getStampBook: async (req,res,next) => {
        try{
            const result = await stampService.getStampBook(req.query.user, req.query.facility);
            res.status(200).json(result);
        }catch(err){
            res.status(404).json({message: "Failed to retrieve stampbooks!"});
        }
    },
    /** create stampbook with user_id, facility_id */
    createStampBook: async (req,res,next) => {
        try{
            const result = await stampService.createStampBook(req.body);
            res.status(201).json(result[0]);
        }catch(err){
            res.status(409).json({message: err.message});
        }
    },
    /** perform a stamp transaction */
    stampTransaction: async (req,res,next) => {
        try{
            const result = await stampService.stampTransaction(req.body);
            res.status(200).json(result[0]);
        }catch(err){
            next(err);
        }
    }
}