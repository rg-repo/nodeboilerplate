const i18n = require('i18n');
const config = require('@src/config');
const constant = require('@src/constant');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');

function auth(req, res, next) {
  const token = req.header(constant.AUTH_TOKEN);
  if (!token) {
    throw new createError.Unauthorized(i18n.__('NO_TOKEN'));
  }

  try {
    const decoded = jwt.verify(token, config.JWT_PRIVATE_KEY);
    req.user = decoded;
    next();
  } catch (ex) {
    throw new createError.BadRequest(i18n.__('INVALID_TOKEN'));
  }
}

module.exports = auth;
