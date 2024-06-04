const { Pool } = require("pg");

class pgPool {
    constructor(env) {
        const config = require("../config/config")[env];
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
        const { rows } = await client.query(query);
        client.release();
        return rows;
    }

    async end() {
        await this.pool.end();
    }
}

module.exports = {
    pgPool,
};
