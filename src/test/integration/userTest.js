'use strict';

require('mysql2/node_modules/iconv-lite').encodingExists('foo');
const request = require('supertest');
const bcrypt = require('bcrypt');
const { User } = require('@src/database/models/user.model');
const authService = require('@src/service/auth.service');
const userRepo = require('@src/database/repository/user.repository');
const constant = require('@src/constant');
let server;

describe('/api/users', () => {
  beforeEach(async () => {
    server = require('@src/index');
  });
  afterEach(async () => {
    server.close();
    await User.destroy({ truncate: true, cascade: false });
  });

  describe('GET /all', () => {
    it('should return all users', async () => {
      await User.bulkCreate([
        {
          firstName: 'FN1',
          lastName: 'LN1',
          email: 'test1@test.com',
          password: '12345',
          phone: '9876543210'
        },
        {
          firstName: 'FN2',
          lastName: 'LN2',
          email: 'test2@test.com',
          password: '12345',
          phone: '9876543211'
        }
      ]);
      let token = await authService.generateToken({ id: 1, isAdmin: true });
      const res = await request(server)
        .get('/api/users/all')
        .set(constant.AUTH_TOKEN, token);
      expect(res.status).toBe(200);
      expect(res.body.data.rows.length).toBe(2);
      expect(
        res.body.data.rows.some((u) => u.firstName === 'FN1')
      ).toBeTruthy();
      expect(
        res.body.data.rows.some((u) => u.firstName === 'FN2')
      ).toBeTruthy();
    });
  });

  describe('POST /', () => {
    let firstName;
    let lastName;
    let email;
    let password;
    let phone;
    let isAdmin;

    const exec = async () => {
      return await request(server)
        .post('/api/users/')
        .send({ firstName, lastName, email, password, phone, isAdmin });
    };

    beforeEach(async () => {
      firstName = 'FN1';
      lastName = 'LN1';
      email = 'test@test.com';
      password = '12345';
      phone = '9876543210';
      isAdmin = true;
    });

    it('should return 400 if user first name is less than 3 cahrs', async () => {
      firstName = 'FN';
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if user first name is greater than 45 cahrs', async () => {
      firstName = new Array(50).join('a');
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if user first name is not a string', async () => {
      firstName = 1;
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if user last name is greater than 45 cahrs', async () => {
      lastName = new Array(50).join('a');
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if user last name is not a string', async () => {
      lastName = 1;
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if user email is less than 5 cahrs', async () => {
      email = 'emai';
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if user email is greater than 255 cahrs', async () => {
      email = new Array(260).join('a');
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if user email is not a string', async () => {
      email = 1;
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if user email is not valid', async () => {
      email = 'invalidEmailString';
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if user password is less than 5 cahrs', async () => {
      password = 'pass';
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if user password is greater than 45 cahrs', async () => {
      password = new Array(50).join('a');
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if user password is not a string', async () => {
      password = 1;
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if user phone is less than 10 cahrs', async () => {
      phone = '12345';
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if user phone is greater than 45 cahrs', async () => {
      phone = new Array(50).join('a');
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if user phone is not a string', async () => {
      phone = 1;
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if user isAdmin is not boolean', async () => {
      isAdmin = 'NotBoolean';
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if user email already exist', async () => {
      const user = {
        firstName: 'FN1',
        lastName: 'LN1',
        email: 'test@test.com',
        password: '12345',
        phone: '9876543210'
      };
      await userRepo.createUser(user);
      email = 'test@test.com';
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if user phone already exist', async () => {
      const user = {
        firstName: 'FN1',
        lastName: 'LN1',
        email: 'test@test.com',
        password: '12345',
        phone: '9876543210'
      };
      await userRepo.createUser(user);
      phone = '9876543210';
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should save the user if it is valid', async () => {
      await exec();
      const user = await userRepo.getUserByEmail(email);
      expect(user).not.toBeNull();
    });
    it('should return the user if it is valid', async () => {
      const res = await exec();
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data).toHaveProperty('email', 'test@test.com');
    });
  });

  describe('PUT /', () => {
    let token;
    let id;
    let firstName;
    let lastName;
    let email;
    let phone;
    let isAdmin;
    let isDeleted;
    let isLocked;

    const exec = async () => {
      return await request(server)
        .put('/api/users/')
        .set(constant.AUTH_TOKEN, token)
        .send({
          id,
          firstName,
          lastName,
          email,
          phone,
          isAdmin,
          isDeleted,
          isLocked
        });
    };

    beforeEach(async () => {
      token = await authService.generateToken({ id: 1, isAdmin: true });
      id = 404;
      firstName = 'FN1';
      lastName = 'LN1';
      email = 'test@test.com';
      phone = '9876543210';
      isAdmin = true;
      isDeleted = false;
      isLocked = false;
    });

    it('should return 400 if user id is not a number', async () => {
      id = 'string';
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if user first name is less than 3 cahrs', async () => {
      firstName = 'FN';
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if user first name is greater than 45 cahrs', async () => {
      firstName = new Array(50).join('a');
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if user first name is not a string', async () => {
      firstName = 1;
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if user last name is greater than 45 cahrs', async () => {
      lastName = new Array(50).join('a');
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if user last name is not a string', async () => {
      lastName = 1;
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if user email is less than 5 cahrs', async () => {
      email = 'emai';
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if user email is greater than 255 cahrs', async () => {
      email = new Array(260).join('a');
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if user email is not a string', async () => {
      email = 1;
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if user email is not valid', async () => {
      email = 'invalidEmailString';
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if user phone is less than 10 cahrs', async () => {
      phone = '12345';
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if user phone is greater than 45 cahrs', async () => {
      phone = new Array(50).join('a');
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if user phone is not a string', async () => {
      phone = 1;
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if user isAdmin is not boolean', async () => {
      isAdmin = 'NotBoolean';
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if user isDeleted is not boolean', async () => {
      isDeleted = 'NotBoolean';
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if user isLocked is not boolean', async () => {
      isLocked = 'NotBoolean';
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 404 if user id does not exist', async () => {
      const res = await exec();
      expect(res.status).toBe(404);
    });
    it('should update and return updated user if it is valid', async () => {
      let user = {
        firstName: 'FN1',
        lastName: 'LN1',
        email: 'test@test.com',
        password: '12345',
        phone: '9876543210'
      };
      user = await userRepo.createUser(user);
      id = user.id;
      firstName = 'Updated';
      email = 'updated@email.com';
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('firstName', 'Updated');
      expect(res.body.data).toHaveProperty('email', 'updated@email.com');
    });
  });

  describe('Delete /:id', () => {
    it('should return 404 if passed id do not exist', async () => {
      const token = await authService.generateToken({ id: 1, isAdmin: true });
      const res = await request(server)
        .delete('/api/users/404')
        .set(constant.AUTH_TOKEN, token);
      expect(res.status).toBe(404);
    });
    it('should delete user if valid id is passed', async () => {
      const token = await authService.generateToken({ id: 1, isAdmin: true });
      let user = {
        firstName: 'FN1',
        lastName: 'LN1',
        email: 'test@test.com',
        password: '12345',
        phone: '9876543210'
      };
      user = await userRepo.createUser(user);
      const res = await request(server)
        .delete('/api/users/' + user.id)
        .set(constant.AUTH_TOKEN, token);
      expect(res.status).toBe(200);

      user = await userRepo.getUserByEmail('test@test.com');
      expect(user.isDeleted).toBeTruthy();
    });
  });

  describe('GET /', () => {
    it('should return user if token with valid id is passed', async () => {
      let user = {
        firstName: 'FN1',
        lastName: 'LN1',
        email: 'test@test.com',
        password: '12345',
        phone: '9876543210'
      };
      user = await userRepo.createUser(user);
      const token = await authService.generateToken({
        id: user.id,
        isAdmin: true
      });
      const res = await request(server)
        .get('/api/users/')
        .set(constant.AUTH_TOKEN, token);
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('firstName', 'FN1');
      expect(res.body.data).toHaveProperty('lastName', 'LN1');
      expect(res.body.data).toHaveProperty('email', 'test@test.com');
      expect(res.body.data).toHaveProperty('password', '12345');
      expect(res.body.data).toHaveProperty('phone', '9876543210');
    });
    it('should return 404 if id passed in token do not exist', async () => {
      const token = await authService.generateToken({ id: 1, isAdmin: true });
      const res = await request(server)
        .get('/api/users/')
        .set(constant.AUTH_TOKEN, token);
      expect(res.status).toBe(404);
    });
  });

  describe('PUT /changePassword', () => {
    let token;
    let password;
    let newPassword;
    let confirmNewPassword;
    let user;

    const exec = async () => {
      return await request(server)
        .put('/api/users/changePassword')
        .set(constant.AUTH_TOKEN, token)
        .send({ password, newPassword, confirmNewPassword });
    };

    beforeEach(async () => {
      password = '12345';
      newPassword = '123456';
      confirmNewPassword = '123456';
      const salt = await bcrypt.genSalt(10);
      const encryptedPasssword = await bcrypt.hash(password, salt);
      user = {
        firstName: 'FN1',
        lastName: 'LN1',
        email: 'test@test.com',
        password: encryptedPasssword,
        phone: '9876543210'
      };
      user = await userRepo.createUser(user);
      token = await authService.generateToken({ id: user.id, isAdmin: true });
    });

    it('should return 400 if user password is less than 5 cahrs', async () => {
      password = 'pass';
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if user password is greater than 45 cahrs', async () => {
      password = new Array(50).join('a');
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if user password is not a string', async () => {
      password = 1;
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if user newPassword is less than 5 cahrs', async () => {
      newPassword = 'pass';
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if user newPassword is greater than 45 cahrs', async () => {
      newPassword = new Array(50).join('a');
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if user newPassword is not a string', async () => {
      newPassword = 1;
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if user confirmNewPassword is less than 5 cahrs', async () => {
      confirmNewPassword = 'pass';
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if user confirmNewPassword is greater than 45 cahrs', async () => {
      confirmNewPassword = new Array(50).join('a');
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if user confirmNewPassword is not a string', async () => {
      confirmNewPassword = 1;
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if user confirmNewPassword is not same as newPassword', async () => {
      confirmNewPassword = 'notSame';
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 404 if user id does not exist', async () => {
      token = await authService.generateToken({ id: 404, isAdmin: true });
      const res = await exec();
      expect(res.status).toBe(404);
    });
    it('should return 400 if user current password do not match', async () => {
      password = 'doNotMatch';
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should change password if valid current password and matching new passwords are passed', async () => {
      const res = await exec();
      expect(res.status).toBe(200);

      const user = await userRepo.getUserByEmail('test@test.com');
      const valid = await authService.validatePassword(
        newPassword,
        user.password
      );
      expect(valid).toBeTruthy();
    });
  });
});
