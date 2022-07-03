/* eslint-disable arrow-body-style */
process.env.DATABASE_NAME = 'test';
import request from 'supertest';

import app from '../src/app';
import { createSession, user1, user2 } from './support';
import logger from '../src/lib/logger';

let sessionCookie: string;

jest.spyOn(logger, 'error').mockReturnValue(null);

describe('duels API', () => {
  beforeAll(async () => {
    sessionCookie = await createSession(user1);
  });

  describe('POST /duels', () => {
    test('creates a new duel', async () => {
      const response = await request(app)
        .post('/api/duels')
        .set('Cookie', [sessionCookie])
        .send({ betAmount: 7, sport: 'NFL' })
        .expect(201);

      expect(response.body).toMatchSnapshot({
        _id: expect.any(String),
        code: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });
  });

  describe('DELETE /duel/:id', () => {
    /* eslint-disable-next-line jest/expect-expect */
    test('deleting a duel succeeds when the user is a player', async () => {
      const createResponse = await request(app)
        .post('/api/duels')
        .set('Cookie', [sessionCookie])
        .send({ betAmount: 7, sport: 'NFL' })
        .expect(201);
      const duelId = createResponse.body._id;

      return request(app)
        .delete(`/api/duels/${duelId}`)
        .set('Cookie', [sessionCookie])
        .expect(200, { message: 'Duel deleted' });
    });

    /* eslint-disable-next-line jest/expect-expect */
    test('deleting a duel returns a 404 if the duel does not exist', async () => {
      return request(app)
        .delete('/api/duels/5c68438fc2481e3e3a97021c')
        .set('Cookie', [sessionCookie])
        .expect(404, { message: 'Duel not found' });
    });
  });

  describe('PUT /duels/accept', () => {
    /* eslint-disable-next-line jest/expect-expect */
    test('accepting a duel fails if the user is already in it', async () => {
      const createResponse = await request(app)
        .post('/api/duels')
        .set('Cookie', [sessionCookie])
        .send({ betAmount: 7, sport: 'NCAAB' })
        .expect(201);
      const { code } = createResponse.body;

      return request(app)
        .put('/api/duels/accept')
        .set('Cookie', [sessionCookie])
        .send({ code })
        .expect(500, { message: 'You are already in this duel!' });
    });

    test('accepting a duel succeeds if the user is not already in it', async () => {
      /* If this test breaks in the future, use nock to mock HTTP calls to Gracenote */

      const createResponse = await request(app)
        .post('/api/duels')
        .set('Cookie', [sessionCookie])
        .send({ betAmount: 7, sport: 'NFL' })
        .expect(201);

      const user2SessionCookie = await createSession(user2);

      await request(app)
        .put('/api/duels/accept')
        .set('Cookie', [user2SessionCookie])
        .send({ code: createResponse.body.code })
        .expect(200, { message: 'Duel accepted!' });

      const acceptedDuelResponse = await request(app)
        .get(`/api/duels/${createResponse.body._id}`)
        .set('Cookie', [user2SessionCookie])
        .expect(200);

      expect(acceptedDuelResponse.body).toEqual(
        expect.objectContaining({
          status: 'active',
          players: [
            { id: user1.id, name: user1.name },
            { id: user2.id, name: user2.name },
          ],
        }),
      );
    });
  });

  describe('GET /duels/:id', () => {
    test('getting a duel returns the duel', async () => {
      const createResponse = await request(app)
        .post('/api/duels')
        .set('Cookie', [sessionCookie])
        .send({ betAmount: 7, sport: 'NCAAB' })
        .expect(201);

      const duelResponse = await request(app)
        .get(`/api/duels/${createResponse.body._id}`)
        .set('Cookie', [sessionCookie])
        .expect(200);

      expect(duelResponse.body).toMatchSnapshot({
        _id: expect.any(String),
        code: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    /* eslint-disable-next-line jest/expect-expect */
    test('getting a duel returns a 404 when not found', async () => {
      return request(app)
        .get('/api/duels/5c68438fc2481e3e3a97021c')
        .set('Cookie', [sessionCookie])
        .expect(404, { message: 'Duel not found!' });
    });
  });

  describe('PUT /duels/:id', () => {
    test('updating a duel returns a 204 when found', async () => {
      const createResponse = await request(app)
        .post('/api/duels')
        .set('Cookie', [sessionCookie])
        .send({ betAmount: 7, sport: 'NCAAB' })
        .expect(201);

      await request(app)
        .put(`/api/duels/${createResponse.body._id}`)
        .set('Cookie', [sessionCookie])
        .send({ status: 'suspended' })
        .expect(204);

      const duelResponse = await request(app)
        .get(`/api/duels/${createResponse.body._id}`)
        .set('Cookie', [sessionCookie])
        .expect(200);

      expect(duelResponse.body).toEqual(
        expect.objectContaining({
          status: 'suspended',
        }),
      );
    });
  });
});
