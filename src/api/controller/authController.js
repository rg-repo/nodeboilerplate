const i18n = require('i18n');
const { prepareResponse } = require('@src/util/response');
const { processLogin } = require('@src/service/authService');

const AuthController = {};

AuthController.login = async (req, res) => {
  const {
    body: { email, password }
  } = req;
  const loginToken = await processLogin(email, password);
  prepareResponse(res, {
    token: loginToken,
    status: true,
    message: i18n.__('LOGGED_IN')
  });
};

module.exports = AuthController;
