const { Router } = require('express');
const router = Router();
const reviewController = require('../controllers/reviewController');
const { body, param, query } = require('express-validator');
const { validatorChecker } = require('../middleware/validator');
const { s3Uploader } = require('../helper/s3Engine');
const { IMG_FILE_TYPES, validateJSONArray, validateHashtagArray, validateIntArray } = require('../helper/helper');
const { checkPermission } = require('../middleware/authMiddleware');


/** Router for "/api/reviews" */
router
    .get(           // GET : get review by review id
        '/:id',
        [
            param('id', `route param 'id' must be a positive integer`).exists().isInt({min: 1}),
            validatorChecker,
        ],
        reviewController.getReview
    )
    .get(           // GET : get review by query
        '/',
        [
            query('facility', `optional query field 'facility' must be a positive integer`).optional().isInt({min: 1}),
            query('user', `optional query field 'user' must be a positive integer`).optional().isInt({min: 1}),
            query('hasImage', `optional query field 'hasImage' must be boolean`).optional().isBoolean(),
            query('hashtags', `optional query field 'hashtags' must be an integer array`)
                .optional()
                .isString()
                .customSanitizer((e) => e.split(',').map((e) => Number(e)))
                .custom(validateIntArray),
            validatorChecker,
        ],
        reviewController.getReviewByQuery
    ).post(         // POST : create review w/ image attachment (up to 1 file)
        '/upload',
        checkPermission([0,1]),
        s3Uploader.single('image'),
        [
            body('authorId', `body field 'authorId' must be a positive integer`).exists().isInt({min: 1}),
            body('facilityId', `body field 'facilityId' must be a positive integer`).exists().isInt({min: 1}),
            body('score', `body field 'score' must be an integer in range 0 ~ 5`).exists().isInt({min: 0, max: 5}),
            body('content', `body field 'content' must be string`).exists().isString(),
            body('hashtags', `body field 'hashtags' must be JSON_string of an array`).exists().custom(validateJSONArray),
            validatorChecker,
        ],
        reviewController.createReview
    ).post(         // POST : edit review contents - content, hashtags
        '/:id',
        checkPermission([0,1]),
        [
            param('id', `route param 'id' must be a positive integer`).exists().isInt({min: 1}),
            body('content', `body field 'content' must be string`).exists().isString(),
            body('hashtags', `body field 'hashtag' must be array of objects, each with keys {id, name}`)
                .exists().isArray().custom(validateHashtagArray),
            validatorChecker,
        ],
        reviewController.updateReview
    ).delete(       // DELETE : delete a review
        '/:id',
        checkPermission([0,1]),
        [
            param('id', `route param 'id' must be a postive integer`).exists().isInt({min: 1}),
            validatorChecker,
        ],
        reviewController.deleteReview
    )
;

/** Router for "api/hashtags" */
const hashtagRoutes = new Router();
hashtagRoutes
    .get(       // GET : get all hashtags
        '/',
        reviewController.getAllHashtags
    ).get(      // GET : get hashtag by id
        '/:id',
        [
            param('id', `route param 'id' must be a positive integer`).exists().isInt({min: 1}),
            validatorChecker,
        ],
        reviewController.getHashtag
    )
;

module.exports = {
    reviewRoutes: router,
    hashtagRoutes: hashtagRoutes,
}

