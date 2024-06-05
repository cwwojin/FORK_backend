const request = require('superagent');

const { s3UriToRequestUrl } = require('./helper');

// API-GW base URL
const apiGwBaseUrl = process.env.API_GW_BASE_URL;

class sightEngineHandler {
    constructor() {
        this.config = {
            apiUser: process.env.SIGHTENGINE_USER,
            apiKey: process.env.SIGHTENGINE_SECRET,
            lang: 'en',
            models: 'nudity-2.1,offensive,text-content,gore-2.0',
            categories: 'profanity,extremism',
            textThreshold: 0.7,
            imageThreshold: 0.8,
        };
        this.config.categoriesArray = this.config.categories.split(',');
    }

    /** Text moderation - ML
     * - check for {sexual, discriminatory, insulting, violent, toxic, self-harm}
     * - result : bool, data: object with scores
     */
    async moderateTextML(text) {
        try {
            const response = await request
                .post('https://api.sightengine.com/1.0/text/check.json')
                .field('text', text)
                .field('mode', 'ml')
                .field('lang', this.config.lang)
                .field('api_user', this.config.apiUser)
                .field('api_secret', this.config.apiKey)
                .accept('json');

            const modClasses = response.body.moderation_classes.available;
            const scoresByClass = modClasses.reduce((acc, curr) => {
                acc[curr] = response.body.moderation_classes[curr];
                return acc;
            }, {});

            const result = !!Object.values(scoresByClass).filter(
                (e) => e > this.config.textThreshold
            ).length;
            return {
                result: result,
                data: scoresByClass,
            };
        } catch (err) {
            throw { status: 500, message: `error during SightEngine API request : ${err.message}` };
        }
    }

    /** Text moderation - Pattern-matching
     * - check for {sexual, discriminatory, insulting, violent, toxic, self-harm}
     * - result : bool, data: object with scores
     */
    async moderateTextPattern(text) {
        try {
            const response = await request
                .post('https://api.sightengine.com/1.0/text/check.json')
                .field('text', text)
                .field('mode', 'rules')
                .field('categories', this.config.categories)
                .field('lang', this.config.lang)
                .field('api_user', this.config.apiUser)
                .field('api_secret', this.config.apiKey)
                .accept('json');

            const matchesByClass = this.config.categoriesArray.reduce((acc, curr) => {
                acc[curr] = response.body[curr].matches;
                return acc;
            }, {});

            const result = !!Object.values(matchesByClass).filter((e) => !!e.length).length;
            return {
                result: result,
                data: matchesByClass,
            };
        } catch (err) {
            throw { status: 500, message: `error during SightEngine API request : ${err.message}` };
        }
    }

    /** Image moderation
     * - check for {nudity, offensive, gore, OCR-text-profanity}
     * - result : bool, data: object with scores
     */
    async moderateImage(uri) {
        try {
            const imageUrl = s3UriToRequestUrl(apiGwBaseUrl, uri);
            const response = await request
                .get('https://api.sightengine.com/1.0/check.json')
                .query({
                    url: imageUrl,
                    models: this.config.models,
                    api_user: this.config.apiUser,
                    api_secret: this.config.apiKey,
                })
                .accept('json');

            const scoresByClass = {
                nudity: 1 - response.body.nudity.none,
                offensive: response.body.offensive.prob,
                gore: response.body.gore.prob,
                textProfanity: response.body.text.profanity,
            };

            const result =
                !![scoresByClass.nudity, scoresByClass.offensive, scoresByClass.gore].filter(
                    (e) => e > this.config.imageThreshold
                ).length || !!scoresByClass.textProfanity.length;
            return {
                result: result,
                data: scoresByClass,
            };
        } catch (err) {
            throw { status: 500, message: `error during SightEngine API request : ${err.message}` };
        }
    }

    /** perform content moderation on a review / post
     * - (input) review object { content, img_uri }
     * - 2 moderations : text & image
     * - result : if at least 1 moderation fails, return false result & data
     */
    async moderateUserContent(data) {
        let textResult;
        let imageResult;

        // text moderation on content
        if (data.content) {
            // textResult = await this.moderateTextML(data.content);
            textResult = await this.moderateTextPattern(data.content);
        } else {
            textResult = { result: false, message: 'No text provided' };
        }

        // image moderation on img_uri
        if (data.imgUri) {
            imageResult = await this.moderateImage(data.imgUri);
        } else {
            imageResult = { result: false, message: 'No image provided' };
        }

        // make final result
        const moderationResult = {
            result: textResult.result || imageResult.result,
            text: textResult,
            image: imageResult,
        };
        return moderationResult;
    }
}

module.exports = new sightEngineHandler();
