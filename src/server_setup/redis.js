const redis = require('redis');
const config = require('@src/config');
const asyncRedis = require('async-redis');
const logger = require('./logging');

const client = redis.createClient({
  port: config.REDIS_PORT,
  host: config.REDIS_HOST
});
const asyncRedisClient = asyncRedis.decorate(client);

client.on('connect', () => {
  logger.logInfo('Connected to Redis');
});

client.on('error', (err) => {
  logger.logError(`Something went wrong while connecting Redis ${err}`);
});

module.exports = asyncRedisClient;
