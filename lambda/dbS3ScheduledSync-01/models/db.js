const { Pool } = require("pg");

const env = process.env.NODE_ENV || 'development';

class pgPool {
    constructor(env) {
        this.config = require('../config/config')[env];
        this.pool = new Pool({
            host: config.host,
            user: config.username,
            password: config.password,
            database: config.database,
            port: 5432,
            max: 10,
        });
    }

    async query(query) {
        const client = await this.pool.connect();
        return client.query(query);
    }
}