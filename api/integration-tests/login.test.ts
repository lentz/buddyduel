import { strictEqual } from 'node:assert';
import { describe, it } from 'node:test';

import request from 'supertest';
import type { Logger } from 'winston';

import app from '../src/app.ts';
import logger from '../src/lib/logger.ts';

import { createSession, user1 } from './support.ts';

describe('login API', () => {
  it('access is denied when no session cookie is present', async (t) => {
    t.mock.method(logger, 'warn', () => ({}) as Logger);

    await request(app)
      .get('/api/duels')
      .expect(401, { message: 'You are not logged in' });
  });

  describe('authenticated access', () => {
    it('access is allowed when the session exists', async (t) => {
      const sessionCookie = await createSession(user1, t);

      const res = await request(app)
        .get('/api/duels?status=active')
        .set('Cookie', [sessionCookie]);

      strictEqual(res.status, 200);
    });
  });
});
