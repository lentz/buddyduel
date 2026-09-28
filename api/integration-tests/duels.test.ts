import { deepStrictEqual, match, strictEqual } from 'node:assert';
import { describe, it } from 'node:test';

import request from 'supertest';
import type { Logger } from 'winston';

import app from '../src/app.ts';
import { dependencies } from '../src/controllers/duels.ts';
import logger from '../src/lib/logger.ts';

import { createSession, user1, user2 } from './support.ts';

describe('duels API', () => {
  describe('POST /duels', () => {
    it('creates a new duel', async (t) => {
      const sessionCookie = await createSession(user1, t);
      const response = await request(app)
        .post('/api/duels')
        .set('Cookie', [sessionCookie])
        .send({ betAmount: 7, sport: 'NFL' })
        .expect(201);

      match(response.body._id, /^[\da-f]{24}$/);
      match(response.body.code, /^[\da-f]{8}$/);
      strictEqual(response.body.status, 'pending');
      strictEqual(response.body.betAmount, 7);
      strictEqual(response.body.sport, 'NFL');
      deepStrictEqual(
        response.body.players.map((player: { id: string; name: string }) => ({
          id: player.id,
          name: player.name,
        })),
        [{ id: user1.id, name: user1.name }],
      );
    });
  });

  describe('DELETE /duel/:id', () => {
    it('deleting a duel succeeds when the user is a player', async (t) => {
      const sessionCookie = await createSession(user1, t);
      const createResponse = await request(app)
        .post('/api/duels')
        .set('Cookie', [sessionCookie])
        .send({ betAmount: 7, sport: 'NFL' })
        .expect(201);
      const duelId = createResponse.body._id;

      await request(app)
        .delete(`/api/duels/${duelId}`)
        .set('Cookie', [sessionCookie])
        .expect(200, { message: 'Duel deleted' });
    });

    it('deleting a duel returns a 404 if the duel does not exist', async (t) => {
      const sessionCookie = await createSession(user1, t);
      await request(app)
        .delete('/api/duels/5c68438fc2481e3e3a97021c')
        .set('Cookie', [sessionCookie])
        .expect(404, { message: 'Duel not found' });
    });
  });

  describe('PUT /duels/accept', () => {
    it('accepting a duel fails if the user is already in it', async (t) => {
      const sessionCookie = await createSession(user1, t);
      t.mock.method(logger, 'error', () => ({}) as Logger);

      const createResponse = await request(app)
        .post('/api/duels')
        .set('Cookie', [sessionCookie])
        .send({ betAmount: 7, sport: 'NCAAB' })
        .expect(201);
      const { code } = createResponse.body;

      await request(app)
        .put('/api/duels/accept')
        .set('Cookie', [sessionCookie])
        .send({ code })
        .expect(500, { message: 'You are already in this duel!' });
    });

    it('accepting a duel succeeds if the user is not already in it', async (t) => {
      const sessionCookie = await createSession(user1, t);
      const createResponse = await request(app)
        .post('/api/duels')
        .set('Cookie', [sessionCookie])
        .send({ betAmount: 7, sport: 'NFL' })
        .expect(201);

      const user2SessionCookie = await createSession(user2, t);

      t.mock.method(dependencies, 'updateDuelWeeks', async () => undefined);

      await request(app)
        .put('/api/duels/accept')
        .set('Cookie', [user2SessionCookie])
        .send({ code: createResponse.body.code })
        .expect(200, { message: 'Duel accepted!' });

      const acceptedDuelResponse = await request(app)
        .get(`/api/duels/${createResponse.body._id}`)
        .set('Cookie', [user2SessionCookie])
        .expect(200);

      strictEqual(acceptedDuelResponse.body.status, 'active');
      deepStrictEqual(
        acceptedDuelResponse.body.players.map(
          (player: { id: string; name: string }) => ({
            id: player.id,
            name: player.name,
          }),
        ),
        [
          { id: user1.id, name: user1.name },
          { id: user2.id, name: user2.name },
        ],
      );
    });
  });

  describe('GET /duels/:id', () => {
    it('getting a duel returns the duel', async (t) => {
      const sessionCookie = await createSession(user1, t);
      const createResponse = await request(app)
        .post('/api/duels')
        .set('Cookie', [sessionCookie])
        .send({ betAmount: 7, sport: 'NCAAB' })
        .expect(201);

      const duelResponse = await request(app)
        .get(`/api/duels/${createResponse.body._id}`)
        .set('Cookie', [sessionCookie])
        .expect(200);

      match(duelResponse.body._id, /^[\da-f]{24}$/);
      match(duelResponse.body.code, /^[\da-f]{8}$/);
      strictEqual(duelResponse.body.status, 'pending');
      strictEqual(duelResponse.body.betAmount, 7);
      strictEqual(duelResponse.body.sport, 'NCAAB');
    });

    it('getting a duel returns a 404 when not found', async (t) => {
      const sessionCookie = await createSession(user1, t);
      await request(app)
        .get('/api/duels/5c68438fc2481e3e3a97021c')
        .set('Cookie', [sessionCookie])
        .expect(404, { message: 'Duel not found!' });
    });
  });

  describe('PUT /duels/:id', () => {
    it('updating a duel returns a 204 when found', async (t) => {
      const sessionCookie = await createSession(user1, t);
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

      strictEqual(duelResponse.body.status, 'suspended');
    });
  });
});
