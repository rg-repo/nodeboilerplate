const i18n = require('i18n');
const logger = require('@src/server_setup/logging');
const { prepareResponse } = require('@src/util/response');
const createError = require('http-errors');

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  logger.logError(err);
  let resMeta = {
    status: false,
    statusCode: 500,
    message: i18n.__('SOMETHING_FAILED')
  };
  if (err && err.validationError) {
    resMeta = {
      ...resMeta,
      statusCode: 400,
      message: err.message,
      data: err.validationError
    };
  } else if (err instanceof createError.HttpError) {
    resMeta = {
      ...resMeta,
      statusCode: err.statusCode,
      message: err.message
    };
  }

  prepareResponse(res, resMeta);
};
