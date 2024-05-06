// sequelize-auto setup script.

const SequelizeAuto = require('sequelize-auto');
const { singularize } = require('sequelize/lib/utils');
const config = require('./config.json')['development'];
const auto = new SequelizeAuto(config.database, config.username, config.password, {
      host: config.host,
      port: "5432",
      dialect: config.dialect,
      directory: '../models',
      caseModel: 'c',
      caseFile: 'c',
      singularize: false,
      additional: {
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
      },
      // tables: [],
      }
);

auto.run((err)=>{
   if(err) throw err;
})