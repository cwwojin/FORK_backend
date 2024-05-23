const userNamePattern = new RegExp("^[a-zA-Z0-9._\-]+$");
const passwordPattern = new RegExp("^[a-zA-Z0-9._\-]+$");

module.exports = {
    /** CONSTANTS */
    BCRYPT_SALTROUNDS: 5,
    /** ENUM */
    USER_TYPES: [0,1,2],
    TRANSACTION_TYPES: [0,1],
    REPORT_TYPES: [0,1],
    REPORT_STATUS: [0,1],
    IMG_FILE_TYPES: ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd'],
    /** user type checks */
    isAdmin: (headers) => headers.userType === 0,
    isKAISTUser: (headers) => headers.userType === 1,
    isFacilityUser: (headers) => headers.userType === 2,
    /** general helpers */
    parseBoolean: (string) => {
        return string === "true" ? true : string === "false" ? false : undefined;
    },
    toDateTimeString: () => {
        const date = new Date();
        return date.toISOString().split('T')[0];
    },
    makeS3Uri: (bucket, key) => {
        return `s3://${bucket}/${key}`;
    },
    splitS3Uri: (uri) => {
        const url = new URL(uri);
        return {
            Bucket: url.hostname,
            Key: url.pathname.startsWith('/') ? url.pathname.slice(1) : url.pathname
        };
    },
    /** request validation */
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
    validateIntArray: (data) => {
        return data.every((e) => Number.isInteger(e));
    },
    validateHashtagArray: (data) => {
        return data.every((e) => ('id' in e && 'name' in e));
    },
    validateMapArea: (area) => {
        return ('latMin' in area) && ('lngMin' in area) && ('latMax' in area) && ('lngMax' in area);
    },
}