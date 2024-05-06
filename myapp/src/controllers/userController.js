const userService = require("../services/userService");


module.exports = {
    // get all users
    getUsers: async (req,res,next) => {
        const result = await userService.getUsers();
        res.status(200).json(result);
    },
    // get user by ID
    getUserById: async (req,res,next) => {
        const id = Number(req.params.id);
        const result = await userService.getUserById(id);
        if (result){
            res.status(200).json(result);
        }else{
            res.status(404).json({message: `No user with id: ${id}`});
        }
    },
    // create new user
    createUser: async (req,res,next) => {
        try{
            const result = await userService.createUser(req.body);
            res.status(201).json(result);
        }catch(err){
            res.status(409).json({message: err.message});
        }
    },
    // update user - profile
    // update user - preferences
    // update user - favorites

}