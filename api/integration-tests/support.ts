import type { TestContext } from 'node:test';

import supertest from 'supertest';

import app from '../src/app.ts';

export async function createSession(user: { idToken: string }, t: TestContext) {
  const fetchMock = t.mock.method(
    global,
    'fetch',
    async () =>
      ({
        json: () => Promise.resolve({ id_token: user.idToken }),
        ok: true,
      }) as Response,
  );

  try {
    const authResp = await supertest(app).get('/auth/callback').expect(302);
    const setCookie = authResp.headers['set-cookie'];
    const sessionCookie = (
      Array.isArray(setCookie) ? setCookie : [setCookie]
    ).find((header) => header?.includes('connect.sid'));
    if (!sessionCookie) {
      throw new Error('Session cookie was not returned');
    }
    const cookie = sessionCookie.split(';')[0];
    if (cookie === undefined) {
      throw new Error('Session cookie was empty');
    }
    return cookie;
  } finally {
    fetchMock.mock.restore();
  }
}

export const user1 = {
  id: '1111111111',
  name: 'John Doe',
  idToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMTExMTExMTExIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.d_IzPAQGnYv3b9GmH-mixlWTB_5mmEm3wjmjAOTIt2U',
};

export const user2 = {
  id: '2222222222',
  name: 'Rocky Balboa',
  idToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyMjIyMjIyMjIyIiwibmFtZSI6IlJvY2t5IEJhbGJvYSIsImlhdCI6MTUxNjIzOTAyMn0.z-Ma6ZLo9YRt2l7MdAFlmRUNumLnMQPKWrLqwry634c',
};
