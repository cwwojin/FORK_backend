const userNamePattern = new RegExp('^[a-zA-Z0-9._-]+$');
const passwordPattern = new RegExp('^[a-zA-Z0-9._-]+$');
const KAISTMailPattern = new RegExp('@kaist.ac.kr$');
const searchBarInputPattern = new RegExp('^[ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9!?@#$&()`._+,/"\'-]+$');

module.exports = {
    /** CONSTANTS */
    BCRYPT_SALTROUNDS: 5,
    /** ENUM */
    USER_TYPES: [0, 1, 2],
    TRANSACTION_TYPES: [0, 1],
    REPORT_TYPES: [0, 1],
    REPORT_STATUS: [0, 1],
    IMG_FILE_TYPES: ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd'],
    /** get user info from header */
    getClientId: (req) => req.header('id'),
    /** general helpers */
    parseBoolean: (string) => {
        return string === 'true' ? true : string === 'false' ? false : undefined;
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
            Key: url.pathname.startsWith('/') ? url.pathname.slice(1) : url.pathname,
        };
    },
    generateRandomCode: () => {
        const num = Math.floor(Math.random() * 1000000);
        return num.toString().padStart(6, '0');
    },
    generateRandomPassword: (length) => {
        return Math.random()
            .toString(36)
            .substring(2, 2 + length);
    },
    splitByDelimiter: (data, delim) => {
        const pos = data ? data.indexOf(delim) : -1;
        return pos > 0 ? [data.substr(0, pos), data.substr(pos + 1)] : ['', ''];
    },
    /** convert S3 URI -> API-GW URL (for public access) */
    s3UriToRequestUrl: (baseUrl, uri) => {
        const url = new URL(uri);
        const key = url.pathname.startsWith('/') ? url.pathname.slice(1) : url.pathname;
        const parsedKey = key.replaceAll('/', '%2F');

        return `${baseUrl}/s3/${url.hostname}/${parsedKey}`;
    },
    /** request validation */
    validateUserId: (userId) => userNamePattern.test(userId),
    validatePassword: (password) => passwordPattern.test(password),
    validateJSONArray: (data) => {
        try {
            return Array.isArray(JSON.parse(data));
        } catch (err) {
            return false;
        }
    },
    validateIntArray: (data) => {
        return data.every((e) => Number.isInteger(e));
    },
    validateHashtagArray: (data) => {
        return data.every((e) => 'id' in e && 'name' in e);
    },
    validateMapArea: (area) => {
        return 'latMin' in area && 'lngMin' in area && 'latMax' in area && 'lngMax' in area;
    },
    validateOptionalURL: (url) => {
        if (url === '') return true;
        try {
            new URL(url);
            return true;
        } catch (err) {
            return false;
        }
    },
    validateKAISTMail: (email) => KAISTMailPattern.test(email),
    validateSearchInput: (str) => searchBarInputPattern.test(str),
};
