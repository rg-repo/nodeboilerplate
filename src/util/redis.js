const redisClient = require('@src/server_setup/redis');

const Redis = {};

Redis.set = (key, value) => redisClient.set(key, value);

Redis.get = (key) => redisClient.get(key);

Redis.delete = (key) => redisClient.del(key);

module.exports = Redis;
