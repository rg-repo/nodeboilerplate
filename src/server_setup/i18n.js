const i18n = require('i18n');
const path = require('path');
const constant = require('@src/constant');

module.exports = (app) => {
  i18n.configure({
    locales: [constant.ENGLISH_LOCALE, constant.GERMAN_LOCALE],
    directory: path.join(__dirname, '..', 'locales')
  });
  app.use(i18n.init);
};
