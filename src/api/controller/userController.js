const i18n = require('i18n');
const userService = require('@src/service/userService');
const { prepareResponse } = require('@src/util/response');

const UserController = {};

UserController.createUser = async (req, res) => {
  const { body: newUserObj } = req;
  const newUser = await userService.createUser(newUserObj);
  prepareResponse(res, {
    data: newUser,
    message: i18n.__('REGISTERED')
  });
};

UserController.getUser = async (req, res) => {
  const {
    user: { id: userId }
  } = req;
  const user = await userService.getUser(userId);
  prepareResponse(res, {
    status: true,
    data: user,
    message: i18n.__('USER_FETCHED')
  });
};

UserController.getUserById = async (req, res) => {
  const {
    params: { id: userId }
  } = req;
  const user = await userService.getUser(userId);
  prepareResponse(res, {
    data: user,
    message: i18n.__('USER_FETCHED')
  });
};

UserController.getAllUsers = async (req, res) => {
  const {
    query: { page, size }
  } = req;
  const users = await userService.getAllUsers(page, size);
  const resMeta = {
    message: i18n.__('FETCHED_ALL_USERS'),
    data: users
  };
  prepareResponse(res, resMeta);
};

UserController.updateUser = async (req, res) => {
  const { body: updateUserObj } = req;
  const user = await userService.updateUser(updateUserObj);
  const resMeta = {
    message: i18n.__('USER_UPDATED'),
    data: user
  };
  prepareResponse(res, resMeta);
};

UserController.deleteUser = async (req, res) => {
  const {
    params: { id }
  } = req;
  await userService.deleteUser(id);
  const resMeta = {
    message: i18n.__('USER_DELETED')
  };
  prepareResponse(res, resMeta);
};

UserController.changePassword = async (req, res) => {
  const {
    user: { id },
    body: passwords
  } = req;

  await userService.changePassword(id, passwords);
  const resMeta = {
    message: i18n.__('PASSWORD_CHANGED')
  };
  prepareResponse(res, resMeta);
};

module.exports = UserController;
