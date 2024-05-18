const { S3Client } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');
const { toDateTimeString } = require('../helper/helper');

const s3 = new S3Client({
    region: 'ap-southeast-2',
});

const s3Engine = multerS3({
    s3: s3,
    bucket: 'fork-foodies',
    // acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
        cb(null, `images/${toDateTimeString(toDateTimeString())}/${Date.now()}_${file.originalname}`);
    },
});

module.exports = s3Engine;