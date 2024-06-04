// load db info from env variables
module.exports = {
    development: {
        host: process.env.POSTGRES_DEV_HOST,
        database: process.env.POSTGRES_DEV_DATABASE,
        username: process.env.POSTGRES_DEV_USERNAME,
        password: process.env.POSTGRES_DEV_PASSWORD,
        dialect: "postgres",
    },
    test: {
        host: process.env.POSTGRES_TEST_HOST,
        database: process.env.POSTGRES_TEST_DATABASE,
        username: process.env.POSTGRES_TEST_USERNAME,
        password: process.env.POSTGRES_TEST_PASSWORD,
        dialect: "postgres",
    },
    production: {
        host: process.env.POSTGRES_PROD_HOST,
        database: process.env.POSTGRES_PROD_DATABASE,
        username: process.env.POSTGRES_PROD_USERNAME,
        password: process.env.POSTGRES_PROD_PASSWORD,
        dialect: "postgres",
    },
};
