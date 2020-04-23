const bcrypt = require('bcrypt');
const createError = require('http-errors');
const i18n = require('i18n');

const userRepo = require('@src/database/repository/userRepository');
/**
 * private functions
 */

/**
 *
 * @param {*} plainPassword
 */
const getHashedPassword = async (plainPassword) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainPassword, salt);
};

/**
 * public functions
 */
const UserService = {};

UserService.getUserByEmail = (email) => userRepo.getUserByEmail(email);

UserService.updateUser = async (userObj) => {
  const { id } = userObj;
  // check user existance, if not throw error
  const userExists = await userRepo.exists({ id });
  if (!userExists) {
    throw createError.NotFound(i18n.__('USER_NOT_EXIST'));
  }
  // update user
  await userRepo.updateUserByID(userObj, id);
  return userRepo.getUserByPk(id);
};

UserService.deleteUser = async (id) => {
  // check user existance, if not throw error
  const userExists = await userRepo.exists({ id });
  if (!userExists) {
    throw createError.NotFound(i18n.__('USER_NOT_EXIST'));
  }
  return userRepo.updateUserByID({ deletedAt: new Date() }, id);
};

UserService.changePassword = async (id, passwords) => {
  const { oldPassword, newPassword } = passwords;
  // check user existance, if not throw error
  const user = await userRepo.getUserByPk(id);
  if (!user) {
    throw createError.NotFound(i18n.__('USER_NOT_EXIST'));
  }
  // validate old password
  const validPassword = await bcrypt.compare(oldPassword, user.password);
  if (!validPassword) {
    throw new createError.BadRequest(i18n.__('INVALID_PASSWORD'));
  }

  const password = await getHashedPassword(newPassword);
  return userRepo.updateUserByID({ password }, id);
};

UserService.createUser = async (user) => {
  const newUserObj = { ...user };
  // check of user with same email existence
  const userExists = await userRepo.getUserByEmail(user.email);
  if (userExists) {
    throw createError.BadRequest(i18n.__('USER_WITH_EMAIL_EXISTS'));
  } else {
    newUserObj.password = await getHashedPassword(user.password);
    const createdUserObj = await userRepo.createUser(newUserObj);
    return createdUserObj;
  }
};

UserService.getUser = async (userId) => {
  const user = await userRepo.getUserByPk(userId);
  if (!user) {
    throw createError.NotFound(i18n.__('USER_NOT_EXIST'));
  }
  return user;
};

UserService.getAllUsers = (page, size) => {
  const offset = (parseInt(page, 10) - 1) * parseInt(size, 10);
  const limit = parseInt(size, 10);
  return userRepo.getPaginatedUsers(limit, offset);
};

module.exports = UserService;
