const reviewService = require('../services/reviewService');
const { makeS3Uri, getClientId } = require('../helper/helper');

module.exports = {
    /** get review by review id */
    getReview: async (req, res, next) => {
        const id = Number(req.params.id);
        try {
            const result = await reviewService.getReview(id);
            if (result.length !== 0) {
                res.status(200).json({
                    status: 'success',
                    data: result[0],
                });
            } else {
                res.status(404).json({
                    status: 'fail',
                    message: `No review with id: ${id}`,
                });
            }
        } catch (err) {
            next(err);
        }
    },
    /** get reviews by query : userId, facilityId & hashtags, image */
    getReviewByQuery: async (req, res, next) => {
        try {
            const result = await reviewService.getReviewByQuery(req.query);
            res.status(200).json({
                status: 'success',
                data: result,
            });
        } catch (err) {
            next(err);
        }
    },
    /** create review */
    createReview: async (req, res, next) => {
        try {
            const imageUri = req.file !== undefined ? makeS3Uri(req.file.bucket, req.file.key) : '';
            const args = {
                authorId: req.body.authorId,
                facilityId: req.body.facilityId,
                score: req.body.score,
                content: req.body.content,
                hashtags: JSON.parse(req.body.hashtags),
                imageUri: imageUri,
            };
            const result = await reviewService.createReview(args, getClientId(req));
            if (result.length !== 0) {
                res.status(201).json({
                    status: 'success',
                    data: result[0],
                });
            } else {
                res.status(404).json({
                    status: 'fail',
                    message: `No records were inserted`,
                });
            }
        } catch (err) {
            next(err);
        }
    },
    /** update review - content, hashtags */
    updateReview: async (req, res, next) => {
        const id = Number(req.params.id);
        try {
            const result = await reviewService.updateReview(id, req.body);
            if (result.length !== 0) {
                res.status(201).json({
                    status: 'success',
                    data: result[0],
                });
            } else {
                res.status(404).json({
                    status: 'fail',
                    message: `No review with id: ${id}`,
                });
            }
        } catch (err) {
            next(err);
        }
    },
    /** delete a review */
    deleteReview: async (req, res, next) => {
        const id = Number(req.params.id);
        try {
            const result = await reviewService.deleteReview(id);
            res.status(200).json({
                status: 'success',
                data: result[0],
            });
        } catch (err) {
            next(err);
        }
    },
    /** get a summary by facility ID */
    getSummaryByFacilityId: async (req, res, next) => {
        try {
            const result = await reviewService.getSummaryByFacilityId(
                req.params.facility,
                req.query.force
            );
            res.status(200).json({
                status: 'success',
                data: result,
            });
        } catch (err) {
            next(err);
        }
    },
    /** get all hashtags */
    getAllHashtags: async (req, res, next) => {
        try {
            const result = await reviewService.getAllHashtags();
            res.status(200).json({
                status: 'success',
                data: result,
            });
        } catch (err) {
            next(err);
        }
    },
    /** get hashtag by id */
    getHashtag: async (req, res, next) => {
        const id = Number(req.params.id);
        try {
            const result = await reviewService.getHashtag(id);
            if (result.length !== 0) {
                res.status(200).json({
                    status: 'success',
                    data: result[0],
                });
            } else {
                res.status(404).json({
                    status: 'fail',
                    message: `No hashtag with id : ${id}`,
                });
            }
        } catch (err) {
            next(err);
        }
    },
    /** get top-N hashtags of a facility */
    getTopHashtags: async (req, res, next) => {
        try {
            const result = await reviewService.getTopHashtags(req.params.facility, req.query.limit);
            res.status(200).json({
                status: 'success',
                data: result,
            });
        } catch (err) {
            next(err);
        }
    },
};
