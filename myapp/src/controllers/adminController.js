const adminService = require("../services/adminService");

module.exports = {
    /** get report by id */
    getReport: async (req,res,next) => {
        try{
            const id = Number(req.params.id);
            const result = await adminService.getReport(id);
            res.status(200).json(result[0]);
        }catch(err){
            next(err);
        }
    },
    /** get report by query - author_id, type, status */
    getReportByQuery: async (req,res,next) => {
        try{
            const result = await adminService.getReportByQuery(req.query);
            res.status(200).json(result);
        }catch(err){
            next(err);
        }
    },
    /** create a report */
    createReport: async (req,res,next) => {
        try{
            const result = await adminService.createReport(req.body);
            res.status(201).json(result[0]);
        }catch(err){
            next(err);
        }
    },
    /** delete a report by id */
    deleteReport: async (req,res,next) => {
        const id = Number(req.params.id);
        try{
            const result = await adminService.deleteReport(id);
            res.status(200).json({message: `successfully deleted report : ${id}`});
        }catch(err){
            next(err);
        }
    },
    /** handle report - accept a report and perform follow-up action */
    handleReport: async (req,res,next) => {
        const id = Number(req.params.id);
        try{
            const result = await adminService.handleReport(id,req.body);
            res.status(200).json(result[0]);
        }catch(err){
            next(err);
        }
    },

}