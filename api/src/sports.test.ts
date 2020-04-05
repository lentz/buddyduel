import IGame from './models/IGame';
import { sports } from './sports';

const ncaab = sports.find((s) => s.name === 'NCAAB');
const nfl = sports.find((s) => s.name === 'NFL');
const xfl = sports.find((s) => s.name === 'XFL');

describe('sports', () => {
  describe('#getWeekDescription()', () => {
    describe('NCAAB', () => {
      test('is Week 1 for November 6th', () => {
        expect(
          ncaab.getWeekDescription({
            startTime: new Date(`${ncaab.seasonYear}-11-06`),
          } as IGame),
        ).toEqual('Week 1');
      });

      test('is Week 17 for Feb 28th', () => {
        expect(
          ncaab.getWeekDescription({
            startTime: new Date(`${ncaab.seasonYear + 1}-02-28`),
          } as IGame),
        ).toEqual('Week 17');
      });

      test('is Round 1 for Mar 19th', () => {
        expect(
          ncaab.getWeekDescription({
            startTime: new Date(`${ncaab.seasonYear + 1}-03-19`),
          } as IGame),
        ).toEqual('Round 1');
      });

      test('is Round 2 for Mar 21st', () => {
        expect(
          ncaab.getWeekDescription({
            startTime: new Date(`${ncaab.seasonYear + 1}-03-21`),
          } as IGame),
        ).toEqual('Round 2');
      });

      test('is Sweet 16 for Mar 26th', () => {
        expect(
          ncaab.getWeekDescription({
            startTime: new Date(`${ncaab.seasonYear + 1}-03-26`),
          } as IGame),
        ).toEqual('Sweet 16');
      });

      test('is Elite 8 for Mar 28th', () => {
        expect(
          ncaab.getWeekDescription({
            startTime: new Date(`${ncaab.seasonYear + 1}-03-28`),
          } as IGame),
        ).toEqual('Elite 8');
      });

      test('is Final Four for Apr 4th', () => {
        expect(
          ncaab.getWeekDescription({
            startTime: new Date(`${ncaab.seasonYear + 1}-04-04`),
          } as IGame),
        ).toEqual('Final Four');
      });

      test('is Championship for Apr 6th', () => {
        expect(
          ncaab.getWeekDescription({
            startTime: new Date(`${ncaab.seasonYear + 1}-04-06`),
          } as IGame),
        ).toEqual('Championship');
      });
    });

    describe('NFL', () => {
      test('is Week 1 for September 6th', () => {
        expect(
          nfl.getWeekDescription({
            startTime: new Date(`${nfl.seasonYear}-09-06`),
          } as IGame),
        ).toEqual('Week 1');
      });

      test('is Week 17 for December 29th', () => {
        expect(
          nfl.getWeekDescription({
            startTime: new Date(`${nfl.seasonYear}-12-29`),
          } as IGame),
        ).toEqual('Week 17');
      });
    });

    describe('XFL', () => {
      test('is Week 1 for Feb 9th', () => {
        expect(
          xfl.getWeekDescription({
            startTime: new Date(`${xfl.seasonYear}-02-09`),
          } as IGame),
        ).toEqual('Week 1');
      });

      test('is Week 4 for Feb 28th', () => {
        expect(
          xfl.getWeekDescription({
            startTime: new Date(`${xfl.seasonYear}-02-28`),
          } as IGame),
        ).toEqual('Week 4');
      });

      test('is Playoffs for Apr 18th', () => {
        expect(
          xfl.getWeekDescription({
            startTime: new Date(`${xfl.seasonYear}-04-18`),
          } as IGame),
        ).toEqual('Playoffs');
      });

      test('is Championship for Apr 26th', () => {
        expect(
          xfl.getWeekDescription({
            startTime: new Date(`${xfl.seasonYear}-04-26`),
          } as IGame),
        ).toEqual('Championship');
      });
    });
  });
});
