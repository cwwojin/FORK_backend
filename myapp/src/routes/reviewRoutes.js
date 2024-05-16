const { Router } = require('express');
const router = Router();
const reviewController = require('../controllers/reviewController');
const { body, param, query } = require('express-validator');
const { validatorChecker } = require('../middleware/validator');
const multer = require('multer');
const s3Engine = require('../helper/s3Engine');
const { IMG_FILE_TYPES, validateJSONArray } = require('../helper/helper');

const upload = multer({
    storage: s3Engine,
    fileFilter: (req,file,cb) => {
        const fileExt = file.originalname.split('.').pop();
        if(IMG_FILE_TYPES.includes(fileExt)) {
            cb(null, true);
        }else{
            cb(null, false);
        }
    },
});


/** Router for "/api/reviews" */
router
    .get(       // GET : get review by review id
        '/:id',
        [
            param('id').exists().isInt({min: 1}),
            validatorChecker,
        ],
        reviewController.getReview
    )
    .get(       // GET : get review by query
        '/',
        [
            query('facility').optional().isInt({min: 1}),
            query('user').optional().isInt({min: 1}),
            body('hasImage').optional().isBoolean(),
            body('hashtags').optional().isArray(),
            validatorChecker,
        ],
        reviewController.getReviewByQuery
    ).post(     // POST : create review w/ image attachment (up to 1 file)
        '/upload',
        upload.single('image'),
        [
            body('authorId').exists().isInt({min: 1}),
            body('facilityId').exists().isInt({min: 1}),
            body('score').exists().isInt({min: 0, max: 5}),
            body('content').exists().isString(),
            body('hashtags').exists().custom(validateJSONArray),
            validatorChecker,
        ],
        reviewController.createReview
    ).put(      // PUT : edit review contents - content, hashtags
        '/:id',
        [
            param('id').exists().isInt({min: 1}),
            body('content').exists().isString(),
            body('hashtags').exists().isArray(),
            validatorChecker,
        ],
        reviewController.updateReview
    ).delete(
        '/:id',
        [
            param('id').exists().isInt({min: 1}),
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
            param('id').exists().isInt({min: 1}),
            validatorChecker,
        ],
        reviewController.getHashtag
    )
;

module.exports = {
    reviewRoutes: router,
    hashtagRoutes: hashtagRoutes,
}

