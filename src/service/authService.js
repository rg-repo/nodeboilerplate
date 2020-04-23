const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const i18n = require('i18n');
const createError = require('http-errors');
const { JWT_PRIVATE_KEY } = require('@src/config');
const UserRepo = require('@src/database/repository/userRepository');

const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, JWT_PRIVATE_KEY);
};

const authService = {};

authService.processLogin = async (email, password) => {
  const user = await UserRepo.getUserByEmail(email);
  if (!user) {
    throw new createError.NotFound(i18n.__('INVALID_EMAIL'));
  } else if (user.deletedAt) {
    throw new createError.NotFound(i18n.__('ACCOUNT_DELETED'));
  } else {
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new createError.BadRequest(i18n.__('INVALID_PASSWORD'));
    }

    const token = generateToken(user);
    return token;
  }
};

module.exports = authService;
