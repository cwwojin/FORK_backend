const { user } = require("../models/index");

module.exports = {
    // get all users
    getUsers: async () => {
        const result = await user.findAll();
        return result;
    },
    // get user by ID
    getUserById: async (id) => {
        const result = await user.findOne({
            where: { id },
        });
        return result;
    },
    // create new user
    createUser: async (info) => {
        const newUser = {
            account_id: info.userId,
            user_type: info.userType,
            password: info.password,
            email: info.email,
            display_name: info.displayName,
        }
        try{
            const result = await user.create(newUser);
            return result;
        }catch(err) {
            throw new Error(err);
        }
    },

}