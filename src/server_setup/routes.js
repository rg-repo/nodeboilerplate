const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const startupDebugger = require('debug')('app:startup');
const i18nMiddleware = require('@src/middleware/i18nMiddleware');
const error = require('@src/middleware/errorMiddleware');
const apis = require('@src/api');
const config = require('@src/config');
const constant = require('@src/constant');

module.exports = (app) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static('public'));
  app.use(helmet());
  app.use(compression());
  app.use(i18nMiddleware);
  app.use('/api', apis);
  app.use(error);
  if (config.NODE_ENV === constant.DEVELOPMENT) {
    app.use(morgan('tiny'));
    startupDebugger('Morgan Enabled');
  }
};
