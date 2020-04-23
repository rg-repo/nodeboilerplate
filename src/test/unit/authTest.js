require('mysql2/node_modules/iconv-lite').encodingExists('foo');
const auth = require('@src/middleware/authMiddleware');
const authService = require('@src/service/authService');

describe('auth middleware', () => {
  it('it should populate with user details if valid token is provided', async () => {
    const user = { id: 1, isAdmin: true };
    const token = authService.generateToken(user);
    const req = {
      header: jest.fn().mockReturnValue(token)
    };
    const next = jest.fn();
    const res = {};

    auth(req, res, next);
    expect(req.user).toBeDefined();
  });
});
