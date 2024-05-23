const db = require('../models/index');

module.exports = {
    /** get stampbooks by query - user_id, facility_id */
    getStampBook: async (userId, facilityId) => {
        values = [];
        let baseQuery = `select * from stampbook where 1=1 `;
        if (userId !== undefined) {
            values.push(userId);
            baseQuery = baseQuery + `and user_id = $${values.length} `;
        }
        if (facilityId !== undefined) {
            values.push(facilityId);
            baseQuery = baseQuery + `and facility_id = $${values.length}`;
        }
        const result = await db.query({
            text: baseQuery,
            values: values,
        });
        return result.rows;
    },
    /** create stampbook with user_id, facility_id */
    createStampBook: async (body) => {
        query = {
            text: `insert into stampbook (user_id, facility_id) values ($1, $2) returning *`,
            values: [body.userId, body.facilityId],
        };
        const result = await db.query(query);
        return result.rows;
    },
    /**
     * perform a transaction
     * - args: buyer_id, facility_id, seller_id, type, amount
     * 1. create row in "transaction" table
     * 2. update row in "stampbook" corresponding to the buyer & facility
     * 3. transaction type 0: -(amount), 1: +(amount)
     * 4. COMMIT or ROLLBACK
     * */
    stampTransaction: async (args) => {
        try {
            const amountDiff = (!!args.type ? 1 : -1) * args.amount;
            await db.query('BEGIN');
            let result = await db.query({
                text: `insert into transaction (buyer_id, facility_id, seller_id, type, amount)
                    values ($1, $2, $3, $4, $5)
                    returning *`,
                values: [args.buyerId, args.facilityId, args.sellerId, args.type, args.amount],
            });
            result = await db.query({
                text: `update stampbook set cnt = cnt + $1
                    where user_id = $2 and facility_id = $3
                    returning *`,
                values: [amountDiff, args.buyerId, args.facilityId],
            });
            await db.query('COMMIT');
            return result.rows;
        } catch (err) {
            await db.query('ROLLBACK');
            throw new Error(err);
        }
    },
};
