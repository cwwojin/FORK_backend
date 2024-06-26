const db = require('../models/index');
const userService = require('./userService');

module.exports = {
    /** get stampbooks by query - user_id, facility_id */
    getStampBook: async (userId, facilityId) => {
        const values = [];
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
        const query = {
            text: `insert into stampbook (user_id, facility_id) values ($1, $2) returning *`,
            values: [body.userId, body.facilityId],
        };
        const result = await db.query(query);
        return result.rows;
    },
    /**
     * perform a transaction
     * - args: buyer_id, facility_id, seller_id, type, amount
     * 1. create a stampbook (buyer_id, facility_id) if it doesn't exist
     * 2. create row in "transaction" table
     * 3. update row in "stampbook" corresponding to the buyer & facility
     * 4. transaction type 0: -(amount), 1: +(amount)
     * */
    stampTransaction: async (args, clientId) => {
        const client = await db.connect();
        try {
            // facility manager verification
            const myFacilities = await userService.getMyFacility(clientId);
            const allow =
                args.sellerId === clientId &&
                myFacilities.map((e) => e.id).includes(args.facilityId);
            if (!allow) {
                throw {
                    status: 403,
                    message: `Requesting user is not allowed to approve stamp transaction. sellerId : ${clientId}, facilityId = ${args.facilityId}`,
                };
            }

            const amountDiff = (args.type ? 1 : -1) * args.amount;
            await client.query('BEGIN');

            // create stampbook if it doesn't exist
            const checkStampBooks = await module.exports.getStampBook(
                args.buyerId,
                args.facilityId
            );
            if (!checkStampBooks.length)
                await module.exports.createStampBook({
                    userId: args.buyerId,
                    facilityId: args.facilityId,
                });

            let result = await client.query({
                text: `insert into transaction (buyer_id, facility_id, seller_id, type, amount)
                    values ($1, $2, $3, $4, $5)
                    returning *`,
                values: [args.buyerId, args.facilityId, args.sellerId, args.type, args.amount],
            });
            result = await client.query({
                text: `update stampbook set cnt = greatest(cnt + $1, 0)
                    where user_id = $2 and facility_id = $3
                    returning *`,
                values: [amountDiff, args.buyerId, args.facilityId],
            });
            await client.query('COMMIT');
            return result.rows;
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    },
};
