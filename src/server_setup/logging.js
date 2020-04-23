const winston = require('winston');
require('express-async-errors');
const config = require('@src/config');
const constant = require('@src/constant');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { app: 'My Demo Application' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/logFile.log' })
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exception.log' })
  ]
});
if (config.NODE_ENV !== constant.PRODUCTION) {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple()
    })
  );
}

module.exports = {
  logError: (error) => {
    if (typeof error === 'object') {
      if (error.stack) {
        logger.log('error', error.stack);
      } else {
        logger.log('error', JSON.stringify(error));
      }
    } else {
      logger.log('error', error);
    }
  },
  logWarning: (warning) => {
    logger.log('warn', warning);
  },
  logInfo: (info) => {
    logger.log('info', info);
  },
  logMessage: (message, level) => {
    logger.log(level, message);
  },
  queryErrors: (from = new Date(), until = new Date()) => {
    return new Promise((resolve, reject) => {
      logger.query({ from, until }, (err, results) =>
        err ? reject(err) : resolve(results)
      );
    });
  }
};
