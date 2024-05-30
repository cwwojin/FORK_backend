'use strict';

const pg = require('pg');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

const pool = new pg.Pool({
    host: config.host,
    user: config.username,
    password: config.password,
    database: config.database,
    port: 5432,
    max: 10,
});

module.exports = pool;
