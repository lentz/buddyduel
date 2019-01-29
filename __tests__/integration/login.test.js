/*
 * @jest-environment node
 */
process.env.MONGODB_URI = 'mongodb://localhost:27017/buddyduel-test';
const supertest = require('supertest');
const nock = require('nock');
const app = require('../../app');
const db = require('../../lib/db');

const testApp = supertest(app);

describe('login API', () => {
  test('access is denied when no session cookie is present', () => {
    return supertest(app)
      .get('/api/duels')
      .expect(401, { message: 'You are not logged in' });
  });

  describe('authenticated access', () => {
    let sessionCookie;

    beforeAll(async () => {
      nock(`https://${process.env.AUTH0_DOMAIN}`)
        .post('/oauth/token')
        .reply(200, { id_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' });

      const authResp = await testApp
        .get('/auth/callback')
        .expect(200);
      sessionCookie = authResp.headers['set-cookie']
        .find(header => /connect.sid/.test(header))
        .split(';')[0];
    });

    test('access is allowed when the session exists', () => {
      return testApp.get('/api/duels?status=active')
        .set('Cookie', [sessionCookie])
        .expect(200, []);
    });
  });
});
