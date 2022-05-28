/* eslint-disable arrow-body-style, jest/expect-expect */
process.env.DATABASE_NAME = 'test';
import request from 'supertest';
import app from '../src/app';
import { createSession, user1 } from './support';
import logger from '../src/lib/logger';

describe('login API', () => {
  test('access is denied when no session cookie is present', () => {
    jest.spyOn(logger, 'warn').mockReturnValue(null);

    return request(app)
      .get('/api/duels')
      .expect(401, { message: 'You are not logged in' });
  });

  describe('authenticated access', () => {
    test('access is allowed when the session exists', async () => {
      const sessionCookie = await createSession(user1);

      return request(app)
        .get('/api/duels?status=active')
        .set('Cookie', [sessionCookie])
        .expect(200);
    });
  });
});
