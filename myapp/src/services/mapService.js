const db = require('../models/index');
const { parseBoolean } = require('../helper/helper');

module.exports = {
    /** get location by facility id */
    getLocation: async (id) => {
        query = {
            text: `select * from facility_pin_avgscore where id = $1`,
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
            text: `select fpa.* from facility_pin_avgscore fpa
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
        let queries = [];
        let values = [];
        queries.push('(' + `select * from facility_pin_avgscore where 1=1 ` + ((args.name) ? `and name ilike '%${args.name}%' ` : '') + ')');
        if(parseBoolean(args.openNow)){
            queries.push(`(select fpa.*
                from facility_pin_avgscore fpa 
                left join opening_hours oh on fpa.id = oh.facility_id
                where oh.day = 1 and now()::time between oh.open_time and oh.close_time)`
            );
        }
        if(args.preferences){
            queries.push(`(select fpa.id, fpa.name, fpa.slug, fpa.lat, fpa.lng, fpa.avg_score from facility_pin_avgscore fpa 
                left join facility_preference fp on fpa.id = fp.facility_id 
                left join preference p on fp.preference_id = p.id
                group by fpa.id, fpa.name, fpa.slug, fpa.lat, fpa.lng, fpa.avg_score 
                having array_agg(p.id) && $1)`
            );
            values.push(args.preferences);
        }
        const query = {
            text: queries.join(' intersect '),
            values: values,
        };
        const result = await db.query(query);
        return result.rows;
    },

}