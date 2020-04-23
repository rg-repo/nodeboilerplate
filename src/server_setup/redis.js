'use strict';

const redis = require("redis");
const config = require("@src/config");
const logger = require('./logging');
const asyncRedis = require("async-redis");

const client = redis.createClient({
    port: config.REDIS_PORT,
    host: config.REDIS_HOST
});
const asyncRedisClient = asyncRedis.decorate(client);

client.on('connect', function() {
    logger.logInfo('Connected to Redis');
});

client.on('error', function (err) {
    logger.logError('Something went wrong while connecting Redis' + err);
});

module.exports = asyncRedisClient;