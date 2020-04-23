const Sequelize = require('sequelize');
const config = require('@src/config');
const logger = require('./logging');

const db = {};

let sequelize;
try {
  sequelize = new Sequelize(
    `${config.DB_DIALECT}://${config.DB_USERNAME}:${config.DB_PASSWORD}@${config.DB_HOST}:${config.DB_PORT}/${config.DB_NAME}`
  );
  sequelize.authenticate().then(() => logger.logInfo('Connected to DB'));
} catch (error) {
  logger.logError(error);
}

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;
