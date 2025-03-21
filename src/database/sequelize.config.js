require('ts-node/register');
const configs = require('../configs.ts');

module.exports = {
  username: configs.DB_USERNAME,
  password: configs.DB_PASSWORD,
  database: configs.DB_DATABASE,
  host: configs.DB_HOST,
  dialect: 'postgres',
  port: 5432
};