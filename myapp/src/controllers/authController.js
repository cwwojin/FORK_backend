const authService = require("../services/authService");

module.exports = {
    /** login with userId & password */
    loginUser: async (req,res,next) => {
        try{
            const result = await authService.loginUser(req.body);
            res.status(200).json({
                status: "successs",
                data: result,
            });
        }catch(err){
            next(err);
        }
    },
}
