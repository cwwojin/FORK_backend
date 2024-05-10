const userNamePattern = new RegExp("^[a-zA-Z0-9._\-]+$");
const passwordPattern = new RegExp("^[a-zA-Z0-9._\-]+$");

module.exports = {
    USER_TYPES: [0,1,2],
    validateUserId: (userId) => 
        userNamePattern.test(userId),
    validatePassword: (password) => 
        passwordPattern.test(password),
}