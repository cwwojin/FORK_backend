const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');

const { toDateTimeString, splitS3Uri, IMG_FILE_TYPES } = require('./helper');

const s3 = new S3Client({
    region: 'ap-southeast-2',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    },
});

const s3Engine = multerS3({
    s3: s3,
    bucket: 'fork-foodies',
    // acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
        cb(
            null,
            `images/${toDateTimeString(toDateTimeString())}/${Date.now()}_${file.originalname}`
        );
    },
});

/**
 * multer middleware
 * - supports certain image formats
 * - upload to S3
 * */
const s3Uploader = multer({
    storage: s3Engine,
    fileFilter: (req, file, cb) => {
        const fileExt = file.originalname.split('.').pop();
        if (IMG_FILE_TYPES.includes(fileExt)) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    },
});

module.exports = {
    s3Uploader: s3Uploader,
    /** helper : delete a single file from S3 */
    removeS3File: async (uri) => {
        try {
            const path = splitS3Uri(uri);
            await s3.send(new DeleteObjectCommand(path));
        } catch (err) {
            if (!['ERR_INVALID_URL', 'ENOTFOUND'].includes(err.code)) throw new Error(err);
        }
    },
};
