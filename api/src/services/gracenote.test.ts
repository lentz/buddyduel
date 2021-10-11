import { readFileSync } from 'fs';

import axios from 'axios';

import { sports } from '../sports';
import * as gracenote from './gracenote';

describe('gracenote', () => {
  describe('#getGames', () => {
    const nfl = sports.find((sport) => sport.name === 'NFL');

    test('returns empty array when there are no matches for the week', async () => {
      jest
        .spyOn(axios, 'get')
        .mockResolvedValueOnce({
          data: {
            datepicker: {
              matchSortByWeek: {
                'Week 1': [],
              },
            },
          },
        })
        .mockResolvedValueOnce({ data: {} });

      const games = await gracenote.getGames(nfl, 'Week 1');

      expect(games).toEqual([]);
    });

    test('sets spreads undefined for games without odds', async () => {
      const scheduledMatch = readFileSync(
        './api/__tests__/sample-data/scheduled-nfl-match.json',
      ).toString();

      jest
        .spyOn(axios, 'get')
        .mockResolvedValueOnce({
          data: {
            datepicker: {
              matchSortByWeek: {
                'Week 1': [{ matchId: '/sport/football/competition:80814' }],
              },
            },
          },
        })
        .mockResolvedValueOnce({ data: { oddsSportsBooks: { matches: [] } } })
        .mockResolvedValueOnce({
          data: JSON.parse(scheduledMatch),
        });

      const games = await gracenote.getGames(nfl, 'Week 1');

      expect(games).toEqual([
        {
          awayTeam: 'Buffalo Bills',
          homeTeam: 'Tennessee Titans',
          id: '/sport/football/competition:80814',
          startTime: new Date('2020-10-13T23:00:00.000Z'),
        },
      ]);
    });

    test('returns the games for each match in the week', async () => {
      const inProgressMatch = readFileSync(
        './api/__tests__/sample-data/inprogress-nfl-match.json',
      ).toString();
      const halftimeMatch = readFileSync(
        './api/__tests__/sample-data/halftime-nfl-match.json',
      ).toString();
      const completeMatch = readFileSync(
        './api/__tests__/sample-data/complete-nfl-match.json',
      ).toString();
      const scheduledMatch = readFileSync(
        './api/__tests__/sample-data/scheduled-nfl-match.json',
      ).toString();
      const delayedMatch = readFileSync(
        './api/__tests__/sample-data/delayed-nfl-match.json',
      ).toString();
      const odds = readFileSync(
        './api/__tests__/sample-data/odds.json',
      ).toString();

      jest
        .spyOn(axios, 'get')
        .mockResolvedValueOnce({
          data: {
            datepicker: {
              matchSortByWeek: {
                'Week 1': [
                  { matchId: '/sport/football/competition:80827' },
                  { matchId: '/sport/football/competition:80912' },
                  { matchId: '/sport/football/competition:80823' },
                  { matchId: '/sport/football/competition:80814' },
                  { matchId: '/sport/football/competition:83448' },
                ],
              },
            },
          },
        })
        .mockResolvedValueOnce({
          data: JSON.parse(odds),
        })
        .mockResolvedValueOnce({
          data: JSON.parse(inProgressMatch),
        })
        .mockResolvedValueOnce({
          data: JSON.parse(halftimeMatch),
        })
        .mockResolvedValueOnce({
          data: JSON.parse(completeMatch),
        })
        .mockResolvedValueOnce({
          data: JSON.parse(scheduledMatch),
        })
        .mockResolvedValueOnce({
          data: JSON.parse(delayedMatch),
        });

      const games = await gracenote.getGames(nfl, 'Week 1');

      expect(games).toMatchInlineSnapshot(`
        Array [
          Object {
            "awayScore": 27,
            "awaySpread": 7,
            "awayTeam": "Los Angeles Chargers",
            "homeScore": 20,
            "homeSpread": -7,
            "homeTeam": "New Orleans Saints",
            "id": "/sport/football/competition:80827",
            "startTime": 2020-10-13T00:15:00.000Z,
            "time": "4Q 1:42",
          },
          Object {
            "awayScore": 6,
            "awaySpread": -13,
            "awayTeam": "Tampa Bay Buccaneers",
            "homeScore": 14,
            "homeSpread": 13,
            "homeTeam": "New York Giants",
            "id": "/sport/football/competition:80912",
            "startTime": 2020-11-03T01:15:00.000Z,
            "time": "Halftime",
          },
          Object {
            "awayScore": 43,
            "awaySpread": 8.5,
            "awayTeam": "Miami Dolphins",
            "homeScore": 17,
            "homeSpread": -8.5,
            "homeTeam": "San Francisco 49ers",
            "id": "/sport/football/competition:80823",
            "startTime": 2020-10-11T20:05:00.000Z,
            "time": "Final",
          },
          Object {
            "awayScore": undefined,
            "awaySpread": -3,
            "awayTeam": "Buffalo Bills",
            "homeScore": undefined,
            "homeSpread": 3,
            "homeTeam": "Tennessee Titans",
            "id": "/sport/football/competition:80814",
            "startTime": 2020-10-13T23:00:00.000Z,
            "time": undefined,
          },
          Object {
            "awayScore": 24,
            "awaySpread": 2.5,
            "awayTeam": "Buffalo Bills",
            "homeScore": 13,
            "homeSpread": -2.5,
            "homeTeam": "Kansas City Chiefs",
            "id": "/sport/football/competition:83448",
            "startTime": 2021-10-11T00:20:00.000Z,
            "time": "Delayed 2Q",
          },
        ]
      `);
    });
  });
});
