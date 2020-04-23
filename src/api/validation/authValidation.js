const joi = require('@hapi/joi');
// const i18n = require('i18n');
const { emailValidation, passwordValidation } = require('./commonValidation');

const loginValidation = joi
  .object({
    email: emailValidation.required(),
    password: passwordValidation.required()
  })
  .options({ abortEarly: true });
module.exports = { loginValidation };
