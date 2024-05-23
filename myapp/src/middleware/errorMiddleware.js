/** Middleware for unhandled errors
 * use passed status or set to 500
 */
module.exports = (error, req, res, next) => {
    res.status(error.status || 500).json({
        status: 'error',
        message: error.message || 'Internal Server Error',
        data: {
            error: error,
        },
    });
};
