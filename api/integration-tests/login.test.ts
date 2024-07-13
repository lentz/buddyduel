/* eslint-disable arrow-body-style */
import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import { Logger } from 'winston';

import app from '../src/app.js';
import { createSession, user1 } from './support.js';
import logger from '../src/lib/logger.js';

describe('login API', () => {
  /* eslint-disable-next-line vitest/expect-expect */
  it('access is denied when no session cookie is present', () => {
    vi.spyOn(logger, 'warn').mockReturnValue({} as Logger);

    return request(app)
      .get('/api/duels')
      .expect(401, { message: 'You are not logged in' });
  });

  describe('authenticated access', () => {
    /* eslint-disable-next-line vitest/expect-expect */
    it('access is allowed when the session exists', async () => {
      const sessionCookie = await createSession(user1);

      const res = await request(app)
        .get('/api/duels?status=active')
        .set('Cookie', [sessionCookie]);

      expect(res.status).toBe(200);
    });
  });
});
