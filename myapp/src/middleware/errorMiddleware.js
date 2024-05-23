const express = require('express');

module.exports = (error, req, res, next) => {
    res.status(error.status || 500).json({
        status: 'error',
        message: error.message || 'Internal Server Error',
        data: {
            error: error,
        },
    });
};
