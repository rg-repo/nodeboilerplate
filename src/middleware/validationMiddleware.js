const createError = require('http-errors');
const i18n = require('i18n');
const logger = require('@src/server_setup/logging');

// base configuration for Joi options
const baseJoiConfig = {
  abortEarly: false
};

// object to map different type of validation objects from request object
const containers = {
  query: {},
  body: {},
  headers: {},
  params: {}
};

module.exports = () => {
  const instance = {};
  Object.keys(containers).forEach((type) => {
    instance[type] = (schema, opts = baseJoiConfig) => {
      return (req, res, next) => {
        const validationRes = schema.validate(req[type], opts);
        if (validationRes.error) {
          const { error } = validationRes;
          logger.logError(validationRes);
          // translate messages
          const messages = error.details.map((detail) => {
            // messages are only being translated for specific variable errors
            const message = detail.path.length
              ? i18n.__(`joi.auth.${detail.path[0]}.${detail.type}`)
              : detail.message
                  .toString()
                  .replace(/\s+/g, '+')
                  .replace(/[^a-zA-Z0-9+,]/g, '')
                  .replace(/[+]/g, ' ')
                  .trim();
            return message;
          });

          throw createError(400, 'validationError', {
            validationError: { messages }
          });
        } else {
          next();
        }
      };
    };
  });
  return instance;
};
