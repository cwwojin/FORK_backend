const db = require("../models/index");
const { parseBoolean } = require("../helper/helper");
const { MeiliSearch } = require("meilisearch");
const meiliClient = new MeiliSearch({
  host: "http://127.0.0.1:7700",
  apiKey: process.env.MEILISEARCH_MASTER_KEY,
});
module.exports = {
  /** get location by facility id */
  getLocation: async (id) => {
    query = {
      text: `select * from facility_pin where id = $1`,
      values: [id],
    };
    const result = await db.query(query);
    return result.rows;
  },
  /**
   * get locations by area
   * (args) (latmin, lngmin, latmax, lngmax)
   * - query locations that are within the boundary
   * - return (id, name, slug, lat, lng, avg_score) for each row
   * */
  getLocationByArea: async (latMin, lngMin, latMax, lngMax) => {
    query = {
      text: `select fpa.* from facility_pin fpa
                where lat between $1 and $2
                and lng between $3 and $4`,
      values: [latMin, latMax, lngMin, lngMax],
    };
    const result = await db.query(query);
    return result.rows;
  },
  /** get locations by query
   * (args) name, openNow, preferences (list)
   * name is searched as case-insensitive substring search
   */
  getLocationByQuery: async (args) => {
    let query = "";
    let filter = [];

    if (args.name) {
      query = args.name;
    }

    if (parseBoolean(args.openNow)) {
      const dayOfWeek = new Date().getDay();
      const currentTime = new Date().toTimeString().split(" ")[0].slice(0, 5); // Get time in HH:MM format
      filter.push(
        `opening_hours.${dayOfWeek}.open_time <= "${currentTime}" AND opening_hours.${dayOfWeek}.close_time >= "${currentTime}"`
      );
    }

    if (args.preferences && args.preferences.length) {
      const preferencesFilter = args.preferences
        .map((preference) => `preference_ids = ${preference}`)
        .join(" OR ");
      filter.push(`(${preferencesFilter})`);
    }

    const searchOptions = {};
    if (filter.length) {
      searchOptions.filter = filter.join(" AND "); // Join filters with AND
    }

    const index = meiliClient.index("facilities");
    const searchResult = await index.search(query, searchOptions);
    return searchResult.hits;
  },
};
