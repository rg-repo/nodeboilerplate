const constant = require('@src/constant');
const logger = require('@src/server_setup/logging');
const EsService = require('./esService');

const UserEsService = {};

UserEsService.searchUser = async (body) => {
  const query = {
    query: {
      multi_match: {
        fields: ['firstName', 'lastName', 'email', 'phone'],
        query: `${body.query}*`,
        type: 'phrase_prefix'
      }
    },
    sort: [{ createdAt: 'asc' }]
  };

  const response = await EsService.searchData(
    constant.ES_USERS_INDEX,
    body.page,
    body.size,
    query
  );
  logger.logInfo(
    `Successfully fetched searched users - ${JSON.stringify(response)}`
  );
  return response.hits.hits.map((hit) => hit._source);
};

module.exports = UserEsService;
