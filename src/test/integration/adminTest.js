require('mysql2/node_modules/iconv-lite').encodingExists('foo');
const request = require('supertest');
const authService = require('@src/service/authService');
const constant = require('@src/constant');

let server;

describe('admin middleware', () => {
  beforeEach(async () => {
    server = require('@src/index');
  });
  afterEach(async () => {
    server.close();
  });
  it('it should return 403 if token provided is of a non admin user', async () => {
    const token = await authService.generateToken({ id: 1, isAdmin: false });
    const res = await request(server)
      .get('/api/users/all')
      .set(constant.AUTH_TOKEN, token);
    expect(res.status).toBe(403);
  });
});
