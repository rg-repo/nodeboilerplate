'use strict';

const i18n = require('i18n');
const constant = require('@src/constant');

function i18nMiddleware(req, res, next) {
    const lang = req.header('lang');
    if(lang) {
        i18n.setLocale(lang);
    } else {
        i18n.setLocale(constant.ENGLISH_LOCALE);
    }
    next();
}

module.exports = i18nMiddleware;