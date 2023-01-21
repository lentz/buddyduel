import { readFileSync } from 'fs';

import axios from 'axios';

import { sports } from '../sports';
import * as oddsApi from './odds-api';

const oddsRes = JSON.parse(
  readFileSync('./api/__tests__/sample-data/odds-res.json').toString(),
);

const scoresRes = JSON.parse(
  readFileSync('./api/__tests__/sample-data/scores-res.json').toString(),
);

describe('oddsApi', () => {
  describe('#getGames', () => {
    const nfl = sports.find((sport) => sport.name === 'NFL');

    test('returns empty array when there are no matches for the week', async () => {
      jest.spyOn(axios, 'get').mockResolvedValue({ data: [] });

      const games = await oddsApi.getGames(nfl);

      expect(games).toEqual([]);
    });

    test('returns the list of games', async () => {
      jest.spyOn(axios, 'get').mockResolvedValueOnce({
        data: oddsRes,
      });

      const games = await oddsApi.getGames(nfl);

      expect(games).toMatchInlineSnapshot(`
        [
          {
            "awaySpread": 10,
            "awayTeam": "Jacksonville Jaguars",
            "homeSpread": -10,
            "homeTeam": "Kansas City Chiefs",
            "id": "a22dba1e3f044281ffb0de4f3f73c530",
            "startTime": 2023-01-21T21:30:00.000Z,
          },
          {
            "awaySpread": 7.5,
            "awayTeam": "New York Giants",
            "homeSpread": -7.5,
            "homeTeam": "Philadelphia Eagles",
            "id": "aafa26cd93281c198d8cdf671db74f8a",
            "startTime": 2023-01-22T01:15:00.000Z,
          },
          {
            "awaySpread": 5,
            "awayTeam": "Cincinnati Bengals",
            "homeSpread": -5,
            "homeTeam": "Buffalo Bills",
            "id": "489f2ff75b6bce303b76e7e9a2a9f8b7",
            "startTime": 2023-01-22T20:00:00.000Z,
          },
          {
            "awaySpread": 3.5,
            "awayTeam": "Dallas Cowboys",
            "homeSpread": -3.5,
            "homeTeam": "San Francisco 49ers",
            "id": "a8a73adf29fc1d8ad03c12473300513e",
            "startTime": 2023-01-22T23:30:00.000Z,
          },
        ]
      `);
    });

    test('returns the games with scores if any games have started', async () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2023-01-22T02:00:00Z'));

      jest
        .spyOn(axios, 'get')
        .mockResolvedValueOnce({ data: oddsRes })
        .mockResolvedValueOnce({ data: scoresRes });

      const games = await oddsApi.getGames(nfl);

      expect(games).toMatchInlineSnapshot(`
        [
          {
            "awayScore": 7,
            "awaySpread": 10,
            "awayTeam": "Jacksonville Jaguars",
            "homeScore": 41,
            "homeSpread": -10,
            "homeTeam": "Kansas City Chiefs",
            "id": "a22dba1e3f044281ffb0de4f3f73c530",
            "startTime": 2023-01-21T21:30:00.000Z,
            "time": "Final",
          },
          {
            "awayScore": 10,
            "awaySpread": 7.5,
            "awayTeam": "New York Giants",
            "homeScore": 35,
            "homeSpread": -7.5,
            "homeTeam": "Philadelphia Eagles",
            "id": "aafa26cd93281c198d8cdf671db74f8a",
            "startTime": 2023-01-22T01:15:00.000Z,
          },
          {
            "awaySpread": 5,
            "awayTeam": "Cincinnati Bengals",
            "homeSpread": -5,
            "homeTeam": "Buffalo Bills",
            "id": "489f2ff75b6bce303b76e7e9a2a9f8b7",
            "startTime": 2023-01-22T20:00:00.000Z,
          },
          {
            "awaySpread": 3.5,
            "awayTeam": "Dallas Cowboys",
            "homeSpread": -3.5,
            "homeTeam": "San Francisco 49ers",
            "id": "a8a73adf29fc1d8ad03c12473300513e",
            "startTime": 2023-01-22T23:30:00.000Z,
          },
        ]
      `);
    });
  });
});
