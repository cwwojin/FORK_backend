"use strict";
require("dotenv").config();
const { pgPool } = require("./models/db");
const { s3Handler } = require("./models/s3");

const s3 = new s3Handler();

/** get ALL image URI's stored in the database
 * - table 'facility_registration_request' -> inside content, keys profileImgUri, stampRuleset.logoImgUri, menu.*.imgUri
 */
const listAllUriFromDB = async (env) => {
    const db = new pgPool(env);
    let uriArray;

    // 1. query img_uri by sources
    const fromReview = await db.query(
        `select distinct img_uri uri from review where img_uri <> ''`
    );
    const fromPost = await db.query(`select distinct img_uri uri from post where img_uri <> ''`);
    const fromUser = await db.query(
        `select distinct profile_img_uri uri from "user" where profile_img_uri <> ''`
    );
    const fromFacility = await db.query(
        `select distinct profile_img_uri uri from facility where profile_img_uri <> ''`
    );
    const fromMenu = await db.query(`select distinct img_uri uri from menu where img_uri <> ''`);
    const fromStampRuleset = await db.query(
        `select distinct logo_img_uri uri from stamp_ruleset where logo_img_uri <> ''`
    );

    // 2. table 'facility_registation_request' -> post-processing on output
    const fromFRR = await db.query(`select content from facility_registration_request`);
    const fromFRRUris = fromFRR.reduce((acc, curr) => {
        const content = curr.content;
        let uris = [
            content.profileImgUri,
            content.stampRuleset ? content.stampRuleset.logoImgUri : undefined,
        ];
        if (content.menu && content.menu.length)
            uris = [...uris, ...content.menu.map((e) => e.imgUri)];
        return [...acc, ...uris];
    }, []);

    uriArray = [fromReview, fromPost, fromUser, fromFacility, fromMenu, fromStampRuleset].reduce(
        (acc, curr) => {
            const uris = curr.map((e) => e.uri);
            return [...acc, ...uris];
        },
        []
    );
    uriArray = [...uriArray, ...fromFRRUris];
    uriArray = [...new Set(uriArray.filter((e) => !!e))];

    await db.end();
    return uriArray;
};

/** get ALL image URI's stored in S3
 * - prefix is different for dev, prod, test 'images/{dev,test,prod}/'
 */
const listAllUriFromS3 = async () => {
    const result = await s3.listObjectsByPrefix("images/");
    return result.map((e) => e.uri);
};

/** perform the s3-DB sync job */
const syncS3DB = async () => {
    const devDbUris = await listAllUriFromDB("development");
    const prodDbUris = await listAllUriFromDB("production");
    const s3Uris = await listAllUriFromS3();

    // calculate delete target : (s3) - (db) -> delete from S3
    const dbSet = new Set([...devDbUris, ...prodDbUris]);
    const urisToDelete = s3Uris.filter((e) => !dbSet.has(e));

    // delete target from S3 (if non-empty)
    let deletedObjects = [];
    if (urisToDelete.length) {
        deletedObjects = await s3.deleteObjectsByUris(urisToDelete);
    }

    const output = {
        timestamp: new Date().toISOString(),
        message: `${deletedObjects.length} objects deleted from s3`,
        data: deletedObjects,
    };
    console.log(output);
    return output;
};

module.exports.handler = async (event) => {
    const result = await syncS3DB();
    return result;
};
