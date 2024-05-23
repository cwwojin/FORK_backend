const db = require('../models/index');
const reviewService = require('./reviewService');

module.exports = {
    /** get report by id */
    getReport: async (id) => {
        const query = {
            text: `select * from report where id = $1`,
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
        let baseQuery = `select * from report where 1=1 `;
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
    createReport: async (body) => {
        const query = {
            text: `insert into report (author_id, type, content, review_id) 
                values ($1, $2, $3, $4) returning *`,
            values: [body.authorId, body.type, body.content, body.reviewId],
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
    handleReport: async (id, body) => {
        const report = await module.exports.getReport(id);
        if (report.length === 0 || report[0]['status'] !== 0) {
            throw { status: 409, message: `Report doesn't exists or is already accepted : ${id}` };
        }
        const reviewId = report[0]['review_id'];
        try {
            await db.query('BEGIN');
            let result = await db.query({
                text: `update report 
                    set status = $1, action = $2, admin_id = $3, respond_date = now()
                    where id = $4 returning *`,
                values: [1, body.action, body.adminId, id],
            });
            result = {
                report: result.rows[0],
            };
            if (body.action === 'delete') {
                const deleteResult = await reviewService.deleteReview(reviewId);
                result.deleteRows = deleteResult;
            }
            await db.query('COMMIT');
            return result;
        } catch (err) {
            await db.query('ROLLBACK');
            throw new Error(err);
        }
    },
};
