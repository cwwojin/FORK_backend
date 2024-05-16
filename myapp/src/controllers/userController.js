const userService = require("../services/userService");

module.exports = {
    // get all users
    getUsers: async (req,res,next) => {
        try{
            const result = await userService.getUsers();
            res.status(200).json({
                status: "success",
                data: result,
            });
        }catch(err){
            next(err);
        }
    },
    // get user by ID
    getUserById: async (req,res,next) => {
        const id = Number(req.params.id);
        try{
            const result = await userService.getUserById(id);
            if(result.length !== 0){
                res.status(200).json({
                    status: "success",
                    data: result[0],
                });
            }else{
                res.status(404).json({
                    status: "fail",
                    message: `No user with id: ${id}`}
                );
            }
        }catch(err){
            next(err);
        }
    },
    // create new user
    createUser: async (req,res,next) => {
        try{
            const result = await userService.createUser(req.body);
            if(result.length !== 0){
                res.status(201).json({
                    status: "success",
                    data: result[0],
                });
            }else{
                res.status(404).json({
                    status: "fail",
                    message: `No records were inserted`,
                });
            }
        }catch(err){
            next(err);
        }
    },
    // update user - profile
    updateUserProfile: async (req,res,next) => {
        const id = Number(req.params.id);
        try{
            const result = await userService.updateUserProfile(req.body, id);
            if(result.length !== 0){
                res.status(201).json({
                    status: "success",
                    data: result[0],
                });
            }else{
                res.status(404).json({
                    status: "fail",
                    message: `No user with id: ${id}`,
                })
            }
        }catch(err){
            next(err);
        }
    },
    // delete user
    deleteUser: async (req,res,next) => {
        const id = Number(req.params.id);
        try{
            const result = await userService.deleteUser(id);
            res.status(200).json({
                status: "success",
                data: result[0],
            });
        }catch(err){
            next(err);
        }
    },
    // get user preferences
    getUserPreference: async (req,res,next) => {
        const id = Number(req.params.id);
        try{
            const result = await userService.getUserPreference(id);
            res.status(200).json({
                status: "success",
                data: result,
            });
        }catch(err){
            next(err);
        }
    },
    // add a preference to user (if it isnt already added)
    addUserPreference: async (req,res,next) => {
        const id = Number(req.params.id);
        try {
            const result = await userService.addUserPreference(id, req.body.preferenceId);
            res.status(201).json({
                status: "success",
                data: result[0],
            });
        }catch(err){
            next(err);
        }
    },
    // delete a preference of a user
    deleteUserPreference: async (req,res,next) => {
        const id = Number(req.params.id);
        try{
            const result = await userService.deleteUserPreference(id, req.body.preferenceId);
            res.status(200).json({
                status: "success",
                data: result[0],
            });
        }catch(err){
            next(err);
        }
    },
    // get user favorites
    getUserFavorite: async (req,res,next) => {
        const id = Number(req.params.id);
        try{
            const result = await userService.getUserFavorite(id);
            res.status(200).json({
                status: "success",
                data: result,
            });
        }catch(err){
            next(err);
        }
    },
    // add a favorite
    addUserFavorite: async (req,res,next) => {
        const id = Number(req.params.id);
        try {
            const result = await userService.addUserFavorite(id, req.body.facilityId);
            res.status(201).json({
                status: "success",
                data: result[0],
            });
        }catch(err){
            next(err);
        }
    },
    // delete a favorite
    deleteUserFavorite: async (req,res,next) => {
        const id = Number(req.params.id);
        try{
            const result = await userService.deleteUserFavorite(id, req.body.facilityId);
            res.status(200).json({
                status: "success",
                data: result[0],
            });
        }catch(err){
            next(err);
        }
    }


}