const joi = require('@hapi/joi');
const { emailValidation, passwordValidation } = require('./commonValidation');

const userObj = joi.object({
  firstName: joi.string().trim().min(3).max(45),
  lastName: joi.string().trim().max(45),
  phone: joi.string().trim().min(10).max(45)
});

const createUser = userObj
  .append({
    email: emailValidation.required(),
    password: passwordValidation.required()
  })
  .required('firstName', 'phone');

const updateUser = userObj.append({ id: joi.number().integer().required() });

const changePassword = joi.object({
  currentPassword: passwordValidation.required(),
  newPassword: passwordValidation.required()
});

module.exports = { createUser, updateUser, changePassword };
