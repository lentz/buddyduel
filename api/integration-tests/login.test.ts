import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import type { Logger } from 'winston';

import app from '../src/app.ts';
import logger from '../src/lib/logger.ts';

import { createSession, user1 } from './support.ts';

describe('login API', () => {
  it('access is denied when no session cookie is present', () => {
    vi.spyOn(logger, 'warn').mockReturnValue({} as Logger);

    return request(app)
      .get('/api/duels')
      .expect(401, { message: 'You are not logged in' });
  });

  describe('authenticated access', () => {
    it('access is allowed when the session exists', async () => {
      const sessionCookie = await createSession(user1);

      const res = await request(app)
        .get('/api/duels?status=active')
        .set('Cookie', [sessionCookie]);

      expect(res.status).toBe(200);
    });
  });
});
