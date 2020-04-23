const joi = require('@hapi/joi');

const emailValidation = joi.string().email().trim().min(5).max(255);
const passwordValidation = joi.string().trim().min(5).max(45);

const pagination = joi
  .object({
    page: joi.number().integer().label('page'),
    size: joi.number().integer().label('size')
  })
  .and('page', 'size')
  .label('pagination');

const idParam = joi.object({
  id: joi.number().integer().required()
});

module.exports = { emailValidation, passwordValidation, pagination, idParam };
