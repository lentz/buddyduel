import supertest from 'supertest';
import { vi } from 'vitest';

import app from '../src/app.js';

export async function createSession(user: any) {
  vi.spyOn(global, 'fetch').mockResolvedValue({
    json: () => Promise.resolve({ id_token: user.idToken }),
    ok: true,
  } as Response);

  const authResp = await supertest(app).get('/auth/callback').expect(302);
  return authResp.headers['set-cookie']
    .find((header: string) => /connect.sid/.test(header))
    .split(';')[0];
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
