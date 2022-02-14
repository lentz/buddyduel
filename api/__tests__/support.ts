import * as nock from 'nock';
import * as supertest from 'supertest';
import app from '../src/app';

export async function createSession(user) {
  nock(`https://${process.env.AUTH0_DOMAIN}`)
    .post('/oauth/token')
    .reply(200, { id_token: user.idToken });

  const authResp = await supertest(app).get('/auth/callback').expect(200);
  return authResp.headers['set-cookie']
    .find((header) => /connect.sid/.test(header))
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
