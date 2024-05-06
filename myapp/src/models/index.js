'use strict';

const Sequelize = require('sequelize');
const initModels = require('./init-models');  // models from sequelize-auto
const process = require('process');
const env = process.env.NODE_ENV || 'development';  // change default value.
const config = require(__dirname + '/../config/config.json')[env];  // edit credentials in JSON if necessary.

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
  	dialect: config.dialect,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    }
  });
}

const db = initModels(sequelize);

module.exports = db;
