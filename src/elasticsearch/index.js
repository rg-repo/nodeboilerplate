const { users } = require('./users');

const elasticSearchMapping = new Map([['users', users]]);

module.exports = { elasticSearchMapping };
