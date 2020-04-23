'use strict';

require('mysql2/node_modules/iconv-lite').encodingExists('foo');
const request = require('supertest');
const authService = require('@src/service/auth.service');
const constant = require('@src/constant');
let server;

describe('auth middleware', () => {
  beforeEach(async () => {
    server = require('@src/index');
  });
  let token;
  const exec = () => {
    return request(server)
      .get('/api/users/all')
      .set(constant.AUTH_TOKEN, token);
  };
  beforeEach(async () => {
    token = await authService.generateToken({ isAdmin: true });
  });
  afterEach(async () => {
    server.close();
  });

  it('it should return 401 if no token is provided', async () => {
    token = '';
    const res = await exec();
    expect(res.status).toBe(401);
  });
  it('it should return 400 if invalid token is provided', async () => {
    token = 'Invalid Token';
    const res = await exec();
    expect(res.status).toBe(400);
  });
  it('it should return 200 if valid token is provided', async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });
});
