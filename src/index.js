require('module-alias/register');
require('express-async-errors');
const winston = require('winston');
const express = require('express');
require('@src/server_setup/logging');
// TODO-SETUP-ES: Uncomment if you want to use elastic search
// const { processElasticSearchIndex } = require('@src/service/esService');

const app = express();

if (!process.env.NODE_ENV) {
  winston.error(
    'Environment is not set. Please set environment and enter values in .env file'
  );
  process.exit(1);
}
const config = require('@src/config');
require('@src/server_setup/db');
// TODO-SETUP-REDIS: Uncomment if you want to use redis
// require('@src/server_setup/redis');
// TODO-SETUP-ES: Uncomment if you want to use elastic search
// require('@src/server_setup/elasticsearch');
require('@src/server_setup/swagger')(app);
require('@src/server_setup/routes')(app);
require('@src/server_setup/handleRejection');
require('@src/server_setup/i18n')(app);

// TODO-SETUP-ES: Uncomment if you want to use elastic search
// processElasticSearchIndex();

const server = app.listen(config.APP_PORT, () =>
  winston.info(`Listening on Port ${config.APP_PORT}`)
);

module.exports = server;
