const _ = require('lodash');
const logger = require('@src/server_setup/logging');
const esClient = require('@src/server_setup/elasticsearch');
const constant = require('@src/constant');
const { elasticSearchMapping } = require('../elasticsearch');

function deleteIndex(esIndexName) {
  return esClient.indices.delete({
    index: esIndexName
  });
}

async function initMapping(esIndexName, mappingInput) {
  const mappedResult = await esClient.indices.putMapping({
    index: esIndexName,
    body: mappingInput
  });

  if (mappedResult.acknowledged) {
    return true;
  }
  logger.logError(mappedResult);
  return false;
}

async function initIndex(esIndexName) {
  const mappingInput = elasticSearchMapping.get(esIndexName);
  if (typeof mappingInput !== 'undefined') {
    const esIndexedResult = await esClient.indices.create({
      index: esIndexName
    });
    if (esIndexedResult.acknowledged) {
      const esMappedResult = initMapping(esIndexName, mappingInput);
      return esMappedResult;
    }
    logger.logError(esIndexedResult);
    return false;
  }
  logger.logError();
  return false;
}

function indexExists(esIndexName) {
  return esClient.indices.exists({ index: esIndexName });
}

function addDocument(esIndexName, processedInputData) {
  return esClient.index({
    index: esIndexName,
    id: processedInputData.id,
    body: processedInputData
  });
}

function addBulkDocument(esIndexName, processedInputData) {
  const bulkBody = [];
  processedInputData.forEach((item) => {
    bulkBody.push({
      index: {
        _index: esIndexName,
        _id: item.id
      }
    });
    bulkBody.push(
      _.pick(item, [
        'firstName',
        'lastName',
        'email',
        'phone',
        'createdAt',
        'updatedAt'
      ])
    );
  });
  return esClient.bulk({ body: bulkBody });
}

function getSuggestions(esIndexName, esIndexType, input) {
  return esClient.suggest({
    index: esIndexName,
    type: esIndexType,
    body: {
      docsuggest: {
        text: input,
        completion: {
          field: 'suggest',
          fuzzy: true
        }
      }
    }
  });
}

function searchData(esIndexName, page, size, query) {
  return esClient.search({
    index: esIndexName,
    from: (page - 1) * size,
    size,
    body: query
  });
}

function updateDocumentById(esIndexName, esIndexType, id, query) {
  return esClient.update({
    index: esIndexName,
    type: esIndexType,
    id,
    body: query
  });
}

function updateDocumentByQuery(esIndexName, esIndexType, id, query) {
  return esClient.updateByQuery({
    index: esIndexName,
    type: esIndexType,
    id,
    body: query
  });
}

async function deleteDocumentById(esIndexName, esIndexType, id) {
  return esClient.delete({
    index: esIndexName,
    type: esIndexType,
    id
  });
}

async function processElasticSearchIndex() {
  try {
    const mappedIndex = [constant.ES_USERS_INDEX].map((index) => {
      return indexExists(index)
        .then((isIndexed) => (isIndexed ? true : initIndex(index)))
        .catch((err) => {
          throw err;
        });
    });
    const data = await Promise.all(mappedIndex);
    logger.logInfo(`All mapped indexes - ${data}`);
  } catch (err) {
    logger.logError(`Error processing indexes - ${err}`);
  }
}

module.exports = {
  deleteIndex,
  initIndex,
  indexExists,
  initMapping,
  addDocument,
  addBulkDocument,
  getSuggestions,
  searchData,
  updateDocumentById,
  updateDocumentByQuery,
  deleteDocumentById,
  processElasticSearchIndex
};
