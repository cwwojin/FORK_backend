const { S3Client, ListObjectsV2Command, DeleteObjectsCommand } = require("@aws-sdk/client-s3");

const Bucket = "fork-foodies";

const splitS3Uri = (uri) => {
    const url = new URL(uri);
    return {
        Bucket: url.hostname,
        Key: url.pathname.startsWith("/") ? url.pathname.slice(1) : url.pathname,
    };
};
const makeS3Uri = (bucket, key) => {
    return `s3://${bucket}/${key}`;
};

class s3Handler {
    constructor() {
        this.s3 = new S3Client({
            region: "ap-southeast-2",
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY,
                secretAccessKey: process.env.AWS_SECRET_KEY,
            },
        });
    }

    /** list objects with prefix
     * - return array of uri & Keys
     */
    async listObjectsByPrefix(prefix) {
        try {
            const command = new ListObjectsV2Command({
                Bucket: Bucket,
                Prefix: prefix,
            });
            const response = await this.s3.send(command);
            const result = response.Contents
                ? response.Contents.map((e) => {
                      return { uri: makeS3Uri(Bucket, e.Key), Key: e.Key };
                  })
                : [];
            return result;
        } catch (err) {
            throw err;
        }
    }

    /** delete multiple objects
     * - provide list of URI as input
     */
    async deleteObjectsByUris(uris) {
        try {
            const keyArray = uris.map((uri) => {
                const path = splitS3Uri(uri);
                return { Key: path.Key };
            });
            const command = new DeleteObjectsCommand({
                Bucket: Bucket,
                Delete: {
                    Objects: keyArray,
                },
                Quiet: true,
            });
            const response = await this.s3.send(command);
            return response.Deleted ? response.Deleted : [];
        } catch (err) {
            if (!["ERR_INVALID_URL", "ENOTFOUND"].includes(err.code)) throw new Error(err);
        }
    }
}

module.exports = {
    splitS3Uri,
    makeS3Uri,
    s3Handler,
};
