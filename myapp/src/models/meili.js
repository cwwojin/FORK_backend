// File: src/models/meiliSetup.js
const { MeiliSearch } = require('meilisearch');

class MeiliClient {
    constructor() {
        this.client = new MeiliSearch({
            host: process.env.MEILI_HOST,
            apiKey: process.env.MEILI_MASTER_KEY,
        });
    }

    async setupIndex() {
        try {
            const meiliIndex = this.client.index('facility_pin');
            await meiliIndex.updateSettings({
                searchableAttributes: [
                    'name',
                    'description',
                    'road_address',
                    'english_address',
                    'preferences',
                ],
                displayedAttributes: [
                    'id',
                    'name',
                    'slug',
                    'profile_img_uri',
                    'description',
                    'lat',
                    'lng',
                    'road_address',
                    'english_address',
                    'avg_score',
                    'opening_hours',
                    'preference_ids',
                    'preferences',
                ],
                filterableAttributes: ['opening_hours', 'preference_ids'],
            });
            this.index = meiliIndex;
        } catch (err) {
            console.log(err);
        }
    }

    async search(query, searchOptions) {
        return this.index.search(query, searchOptions);
    }
}

module.exports = new MeiliClient();
