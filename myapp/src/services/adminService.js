const db = require('../models/index');
const reviewService = require('./reviewService');
const facilityService = require('./facilityService');

module.exports = {
    /** get report by id */
    getReport: async (id) => {
        const query = {
            text: `select * from report_with_review where id = $1`,
            values: [id],
        };
        const result = await db.query(query);
        return result.rows;
    },
    /** get report by query
     * (args) authorId, type, status
     */
    getReportByQuery: async (args) => {
        const authorId = args.user;
        const values = [];
        let baseQuery = `select * from report_with_review where 1=1 `;
        if (authorId !== undefined) {
            values.push(authorId);
            baseQuery = baseQuery + `and author_id = $${values.length} `;
        }
        if (args.type !== undefined) {
            values.push(args.type);
            baseQuery = baseQuery + `and type = $${values.length} `;
        }
        if (args.status !== undefined) {
            values.push(args.status);
            baseQuery = baseQuery + `and status = $${values.length} `;
        }
        const result = await db.query({
            text: baseQuery + `order by created_at desc`,
            values: values,
        });
        return result.rows;
    },
    /** create a report */
    createReport: async (body, clientId) => {
        const query = {
            text: `insert into report (author_id, type, content, review_id) 
                values ($1, $2, $3, $4) returning *`,
            values: [clientId || body.authorId, body.type, body.content, body.reviewId],
        };
        const result = await db.query(query);
        return result.rows;
    },
    /** delete a report by id*/
    deleteReport: async (id) => {
        const query = {
            text: `delete from report where id = $1 returning *`,
            values: [id],
        };
        const result = await db.query(query);
        return result.rows;
    },
    /**
     * handle report - accept a report and perform follow-up action
     * - (param) id
     * - (body) admin_id, action ("delete", etc.)
     *  1. update report -> set status = 1, admin_id, respond_date, action
     *  2. if action == "delete", delete the corresponding review (if review_id is not null)
     * */
    handleReport: async (id, body, clientId) => {
        const client = await db.connect();
        const report = await module.exports.getReport(id);
        if (report.length === 0 || report[0]['status'] !== 0) {
            throw { status: 409, message: `Report doesn't exists or is already accepted : ${id}` };
        }
        const reviewId = report[0]['review_id'];
        try {
            await client.query('BEGIN');
            let result = await client.query({
                text: `update report 
                    set status = $1, action = $2, admin_id = $3, respond_date = now()
                    where id = $4 returning *`,
                values: [1, body.action, clientId || body.adminId, id],
            });
            result = {
                report: result.rows[0],
            };
            if (body.action === 'delete') {
                const deleteResult = await reviewService.deleteReview(reviewId);
                result.deleteRows = deleteResult;
            }
            await client.query('COMMIT');
            return result;
        } catch (err) {
            await client.query('ROLLBACK');
            throw new Error(err);
        } finally {
            client.release();
        }
    },
    /** get facility registration request by id - possible for admin to view content */
    getFacilityRegistrationRequest: async (id) => {
        const query = {
            text: `SELECT * FROM facility_registration_request WHERE id = $1`,
            values: [id],
        };
        const result = await db.query(query);
        return result.rows[0];
    },

    /** get all facility registration requests */
    getAllFacilityRegistrationRequests: async (args) => {
        const values = [];
        let baseQuery = `SELECT * FROM facility_registration_request WHERE 1=1 `;
        if (args.authorId !== undefined) {
            values.push(args.authorId);
            baseQuery = baseQuery + `AND author_id = $${values.length} `;
        }
        if (args.status !== undefined) {
            values.push(args.status);
            baseQuery = baseQuery + `AND status = $${values.length} `;
        }
        const result = await db.query({
            text: baseQuery + `ORDER BY created_at DESC`,
            values: values,
        });
        return result.rows;
    },
    /** accept a facility registration request */
    acceptFacilityRegistrationRequest: async (id) => {
        const client = await db.connect();
        const request = await module.exports.getFacilityRegistrationRequest(id);
        if (!request || request.status !== 0) {
            throw { status: 404, message: `Request doesn't exist or is not pending` };
        }

        const data = request.content; // Assuming content is already an object
        try {
            await client.query('BEGIN');

            // Create the facility and related entries
            const facility = await facilityService.createFacility(data);

            // Handle preferences
            if (data.preferences && data.preferences.length !== 0) {
                for await (const preferenceId of data.preferences) {
                    await facilityService.addPreferenceToFacility(facility.id, preferenceId);
                }
            }

            // Handle stamp ruleset and rewards
            if (data.stampRuleset) {
                await facilityService.createStampRuleset(facility.id, data.stampRuleset);
            }

            // Add the author as manager
            await client.query({
                text: `insert into manages (user_id, facility_id) values ($1, $2)`,
                values: [request.author_id, facility.id],
            });

            // Update the registration request status
            const query = {
                text: `UPDATE facility_registration_request SET status = $1, respond_date = NOW() WHERE id = $2 RETURNING *`,
                values: [1, id],
            };
            const result = await client.query(query);

            await client.query('COMMIT');
            return { request: result.rows[0], facility };
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    /** decline a facility registration request */
    declineFacilityRegistrationRequest: async (id) => {
        const request = await module.exports.getFacilityRegistrationRequest(id);
        if (!request || request.status !== 0) {
            throw { status: 404, message: `Request doesn't exist or is not pending` };
        }

        const query = {
            text: `UPDATE facility_registration_request SET status = $1, respond_date = NOW(), updated_at = NOW() WHERE id = $2 RETURNING *`,
            values: [2, id],
        };
        const result = await db.query(query);
        return result.rows[0];
    },

    /** delete a facility registration request */
    deleteFacilityRegistrationRequest: async (id) => {
        const query = {
            text: `DELETE FROM facility_registration_request WHERE id = $1 RETURNING *`,
            values: [id],
        };
        const result = await db.query(query);
        return result.rows[0];
    },
};
