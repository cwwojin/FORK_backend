const db = require('../models/index');
const { parseBoolean } = require('../helper/helper');

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
        let values = [];
        let baseQuery = `select 
                            fpe.id,
                            fpe.name,
                            fpe.slug,
                            fpe.profile_img_uri,
                            fpe.description,
                            fpe.lat,
                            fpe.lng,
                            fpe.road_address,
                            fpe.english_address,
                            fpe.avg_score,
                            fpe.opening_hours,
                            fpe.preference_ids,
                            fpe.preferences
                        from (select fp.*, json_array_elements(fp.opening_hours) oh from facility_pin fp) fpe where 1=1 `;

        // query parameters
        if (args.name) {
            baseQuery = baseQuery + `and name ilike '%${args.name}%' `;
        }
        if (parseBoolean(args.openNow)) {
            baseQuery =
                baseQuery +
                `and extract(dow from now()) = (fpe.oh->>'day')::integer 
                and now()::time between (fpe.oh->>'open_time')::time and (fpe.oh->>'close_time')::time `;
        }
        if (args.preferences !== undefined && args.preferences.length !== 0) {
            values.push(args.preferences);
            baseQuery = baseQuery + `and fpe.preference_ids && $${values.length} `;
        }

        const { rows } = await db.query({
            text: baseQuery,
            values: values,
        });
        return rows;
    },
};
