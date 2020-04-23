'use strict';

const elasticSearch = require('elasticsearch');
const logger = require('./logging');
const config = require('@src/config');

const elasticClient = new elasticSearch.Client({
    host: `${config.ELASTICSEARCH_HOST}:${config.ELASTICSEARCH_PORT}`
});

elasticClient.ping({
    requestTimeout: 30000
}, function (error) {
    if (error) {
        logger.logError('elasticsearch cluster is down!');
    } else {
        logger.logInfo('elasticsearch is connected');
    }
});

module.exports = elasticClient;