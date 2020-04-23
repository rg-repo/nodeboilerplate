/* eslint-disable no-unused-vars */
const logger = require('./logging');

process.on('unhandledRejection', (reason, promise, res) => {
  logger.logError(reason.stack || reason);
  // eslint-disable-next-line no-console
  console.log(reason.stack || reason);
  process.exit(1);
});
