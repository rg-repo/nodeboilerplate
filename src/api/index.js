const express = require('express');
const validate = require('@src/middleware/validationMiddleware')();
const auth = require('@src/middleware/authMiddleware');
const userController = require('./controller/userController');
const {
  createUser,
  updateUser,
  changePassword
} = require('./validation/userValidation');

const authController = require('./controller/authController');
const { loginValidation } = require('./validation/authValidation');

const { pagination, idParam } = require('./validation/commonValidation');

const router = express.Router();

router.post('/auth', validate.body(loginValidation), authController.login);

router.get(
  '/users/all',
  [auth, validate.query(pagination)],
  userController.getAllUsers
);

router.post('/users', validate.body(createUser), userController.createUser);

router.put(
  '/users',
  [auth, validate.body(updateUser)],
  userController.updateUser
);

router.delete(
  '/users/:id',
  [auth, validate.params(idParam)],
  userController.deleteUser
);

router.get('/users', auth, userController.getUser);
router.get('/users/:id', validate.params(idParam), userController.getUserById);

// router.put(
//   '/users/changePassword',
//   [auth, validate.body(changePassword)],
//   userController.changePassword
// );

module.exports = router;
