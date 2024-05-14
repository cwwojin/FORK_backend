const reviewService = require("../services/reviewService");
const { makeS3Uri } = require("../helper/helper");

module.exports = {
    /** get review by review id */
    getReview: async (req,res,next) => {
        const id = Number(req.params.id);
        try{
            const result = await reviewService.getReview(id);
            if(result.length !== 0){
                res.status(200).json(result[0]);
            }else{
                res.status(404).json({message: `No review with id: ${id}`});
            }
        }catch(err){
            next(err);
        }
    },
    /** get reviews by query : userId, facilityId & hashtags, image */
    getReviewByQuery: async (req,res,next) => {
        try{
            const result = await reviewService.getReviewByQuery(req.query.facility,req.query.user,req.body);
            res.status(200).json(result);
        }catch(err){
            next(err);
        }
    },
    /** create review */
    createReview: async (req,res,next) => {
        try{
            const imageUri = (req.file !== undefined) ? makeS3Uri(req.file.bucket, req.file.key) : '';
            const args = {
                authorId: req.body.authorId,
                facilityId: req.body.facilityId,
                score: req.body.score,
                content: req.body.content,
                hashtags: JSON.parse(req.body.hashtags),
                imageUri: imageUri,
            }
            const result = await reviewService.createReview(args);
            res.status(201).json(result[0]);
        }catch(err){
            next(err);
        }
    },
    /** update review - content, hashtags */
    updateReview: async (req,res,next) => {
        const id = Number(req.params.id);
        try{
            const result = await reviewService.updateReview(id, req.body);
            res.status(201).json(result[0]);
        }catch(err){
            res.status(404).json({message: `No review with id: ${id}`});
        }
    },
    /** delete a review */
    deleteReview: async (req,res,next) => {
        const id = Number(req.params.id);
        try{
            const result = await reviewService.deleteReview(id);
            res.status(200).json({message: `Successfully deleted review : ${id}`});
        }catch(err){
            next(err);
        }
    },
}