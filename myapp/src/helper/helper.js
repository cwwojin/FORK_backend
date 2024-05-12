const userNamePattern = new RegExp("^[a-zA-Z0-9._\-]+$");
const passwordPattern = new RegExp("^[a-zA-Z0-9._\-]+$");

module.exports = {
    USER_TYPES: [0,1,2],
    IMG_FILE_TYPES: ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd'],
    parseBoolean: (string) => {
        string === "true" ? true : string === "false" ? false : undefined;
    },
    toDateTimeString: () => {
        const date = new Date();
        return date.toISOString().split('T')[0];
    },
    makeS3Uri: (bucket, key) => {
        return `s3://${bucket}/${key}`;
    },
    validateUserId: (userId) => 
        userNamePattern.test(userId),
    validatePassword: (password) => 
        passwordPattern.test(password),
    validateJSONArray: (data) => {
        try{
            return Array.isArray(JSON.parse(data));
        }catch(err){
            return false;
        }
    },
}