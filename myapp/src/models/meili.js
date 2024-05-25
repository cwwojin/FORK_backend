// File: src/models/meiliSetup.js
const { MeiliSearch } = require("meilisearch");

// Configure MeiliSearch client
const meiliClient = new MeiliSearch({
  host: process.env.MEILI_HOST,
  apiKey: process.env.MEILI_MASTER_KEY,
});
const meiliIndex = meiliClient.index("facility_pin");

module.exports = {
    meiliClient: meiliClient,
    meiliIndex: meiliIndex,
}