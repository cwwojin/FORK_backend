const db = require('../models/index');
const meiliClient = require('../models/meili');
const { parseBoolean } = require('../helper/helper');

module.exports = {
    /** get location by facility id */
    getLocation: async (id) => {
        const query = {
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
        const query = {
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
        const values = [];
        let baseQuery = `with base as (select f.id, oh from
                facility_pin f,
                json_array_elements(f.opening_hours) oh )
            select fp.*
            from facility_pin fp join base on fp.id = base.id where 1=1 `;

        // query parameters
        if (args.name) {
            baseQuery = baseQuery + `and fp.name ilike '%${args.name}%' `;
        }
        if (parseBoolean(args.openNow)) {
            baseQuery =
                baseQuery +
                `and extract(dow from (now() at time zone 'Asia/Seoul')) = (base.oh->>'day')::integer 
                and (now() at time zone 'Asia/Seoul')::time between (base.oh->>'open_time')::time and (base.oh->>'close_time')::time `;
        }
        if (args.preferences !== undefined && args.preferences.length !== 0) {
            values.push(args.preferences);
            baseQuery = baseQuery + `and fp.preference_ids && $${values.length} `;
        }

        const { rows } = await db.query(baseQuery, values);
        return rows;
    },

    /** get locations by query - with Search Engine
     * (args) name, openNow, preferences (list)
     * - search is done with MeiliSearch (https://www.meilisearch.com/)
     */
    getLocationByQueryMeili: async (args) => {
        let query = '';
        const filter = [];

        // check meili client setup
        if (!Object.prototype.hasOwnProperty.call(meiliClient, 'index')) {
            await meiliClient.setupIndex();
        }

        // name
        if (args.name) {
            query = args.name;
        }

        // open-now
        if (parseBoolean(args.openNow)) {
            const dayOfWeek = new Date().getDay();
            const currentTime = new Date().toTimeString().split(' ')[0].slice(0, 5); // Get time in HH:MM format
            filter.push(
                `opening_hours.${dayOfWeek}.open_time <= "${currentTime}" AND opening_hours.${dayOfWeek}.close_time >= "${currentTime}"`
            );
        }

        // preference id
        if (args.preferences && args.preferences.length) {
            const preferencesFilter = args.preferences
                .map((preference) => `preference_ids = ${preference}`)
                .join(' OR ');
            filter.push(`(${preferencesFilter})`);
        }

        const searchOptions = {};
        if (filter.length) {
            searchOptions.filter = filter.join(' AND '); // Join filters with AND
        }

        const searchResult = await meiliClient.search(query, searchOptions);
        return searchResult.hits;
    },
};
