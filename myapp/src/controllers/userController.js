const userService = require("../services/userService");


module.exports = {
    // get all users
    getUsers: async (req,res,next) => {
        try{
            const result = await userService.getUsers();
            res.status(200).json(result);
        }catch(err){
            next(err);
        }
    },
    // get user by ID
    getUserById: async (req,res,next) => {
        const id = req.params.id;
        try{
            const result = await userService.getUserById(id);
            if(result.length !== 0){
                res.status(200).json(result[0]);
            }else{
                res.status(404).json({message: `No user with id: ${id}`});
            }
        }catch(err){
            next(err);
        }
    },
    // create new user
    createUser: async (req,res,next) => {
        try{
            const result = await userService.createUser(req.body);
            res.status(201).json(result[0])
        }catch(err){
            res.status(409).json({message: 'Failed to insert new user : ' + err.message});
        }
    },
    // update user - profile
    // update user - preferences
    // update user - favorites

}