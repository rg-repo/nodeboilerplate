require('mysql2/node_modules/iconv-lite').encodingExists('foo');
const request = require('supertest');
const bcrypt = require('bcrypt');
const { User } = require('@src/database/models/user');
const constant = require('@src/constant');
const userRepo = require('@src/database/repository/userRepository');

let server;

describe('/api/auth', () => {
  beforeEach(async () => {
    server = require('@src/index');
  });
  afterEach(async () => {
    server.close();
    await User.destroy({ truncate: true, cascade: false });
  });

  describe('POST /', () => {
    let email;
    let phone;
    let password;
    let user;

    const exec = async () => {
      return await request(server)
        .post('/api/auth')
        .send({ email, phone, password });
    };

    beforeEach(async () => {
      email = 'test@test.com';
      phone = '9876543210';
      password = '12345';
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
    it('should return 400 if user email and phone both are not provided', async () => {
      email = '';
      phone = '';
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if user email does not exist in DB', async () => {
      email = 'non@existing.email';
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if user phone does not exist in DB', async () => {
      email = '';
      phone = '1234567890';
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if user isDeleted is true in DB', async () => {
      const salt = await bcrypt.genSalt(10);
      const encryptedPasssword = await bcrypt.hash(password, salt);
      user = {
        firstName: 'FN1',
        lastName: 'LN1',
        email: email,
        password: encryptedPasssword,
        phone: phone,
        isDeleted: true
      };
      user = await userRepo.createUser(user);
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if user isLocked is true in DB', async () => {
      const salt = await bcrypt.genSalt(10);
      const encryptedPasssword = await bcrypt.hash(password, salt);
      user = {
        firstName: 'FN1',
        lastName: 'LN1',
        email: email,
        password: encryptedPasssword,
        phone: phone,
        isLocked: true
      };
      user = await userRepo.createUser(user);
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 400 if invalid password is passed', async () => {
      const salt = await bcrypt.genSalt(10);
      const encryptedPasssword = await bcrypt.hash(password, salt);
      user = {
        firstName: 'FN1',
        lastName: 'LN1',
        email: email,
        password: encryptedPasssword,
        phone: phone
      };
      user = await userRepo.createUser(user);
      password = 'invalid';
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it('should return 200 if valid password and email is passed', async () => {
      const salt = await bcrypt.genSalt(10);
      const encryptedPasssword = await bcrypt.hash(password, salt);
      user = {
        firstName: 'FN1',
        lastName: 'LN1',
        email: email,
        password: encryptedPasssword,
        phone: phone
      };
      user = await userRepo.createUser(user);
      const res = await exec();
      expect(res.status).toBe(200);
    });
    it('should return 200 if valid password and phone is passed', async () => {
      const salt = await bcrypt.genSalt(10);
      const encryptedPasssword = await bcrypt.hash(password, salt);
      user = {
        firstName: 'FN1',
        lastName: 'LN1',
        email: email,
        password: encryptedPasssword,
        phone: phone
      };
      user = await userRepo.createUser(user);
      const res = await request(server)
        .post('/api/auth')
        .send({ phone, password });
      expect(res.status).toBe(200);
    });
    it('should return token in header if logged in successfully', async () => {
      const salt = await bcrypt.genSalt(10);
      const encryptedPasssword = await bcrypt.hash(password, salt);
      user = {
        firstName: 'FN1',
        lastName: 'LN1',
        email: email,
        password: encryptedPasssword,
        phone: phone
      };
      user = await userRepo.createUser(user);
      const res = await exec();
      expect(res.header).toHaveProperty(constant.AUTH_TOKEN);
    });
  });
});
