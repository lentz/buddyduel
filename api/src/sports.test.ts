import IGame from './models/IGame';
import { sports } from './sports';

const ncaab = sports.find(s => s.name === 'NCAAB');
const nfl = sports.find(s => s.name === 'NFL');
const xfl = sports.find(s => s.name === 'XFL');

describe('sports', () => {
  describe('#getWeekDescription()', () => {
    describe('NCAAB', () => {
      test('is 1 for November 6th', () => {
        expect(ncaab.getWeekDescription(
          { startTime: new Date(`${ncaab.seasonYear}-11-06`) } as IGame,
        )).toEqual('Week 1');
      });

      test('is 17 for Feb 28th', () => {
        expect(ncaab.getWeekDescription(
          { startTime: new Date(`${ncaab.seasonYear + 1}-02-28`) } as IGame,
        )).toEqual('Week 17');
      });
    });

    describe('NFL', () => {
      test('is 1 for September 6th', () => {
        expect(nfl.getWeekDescription(
          { startTime: new Date(`${nfl.seasonYear}-09-06`) } as IGame,
        )).toEqual('Week 1');
      });

      test('is 17 for December 29th', () => {
        expect(nfl.getWeekDescription(
          { startTime: new Date(`${nfl.seasonYear}-12-29`) } as IGame,
        )).toEqual('Week 17');
      });
    });

    describe('XFL', () => {
      test('is 1 for Feb 9th', () => {
        expect(xfl.getWeekDescription(
          { startTime: new Date(`${xfl.seasonYear}-02-09`) } as IGame,
        )).toEqual('Week 1');
      });

      test('is 4 for Feb 28th', () => {
        expect(xfl.getWeekDescription(
          { startTime: new Date(`${xfl.seasonYear}-02-28`) } as IGame,
        )).toEqual('Week 4');
      });
    });
  });
});
