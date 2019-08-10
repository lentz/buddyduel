const NFLWeek = require('../../services/NFLWeek');

describe('NFLWeek', () => {
  beforeEach(() => expect.hasAssertions());

  describe('#forGame()', () => {
    test('is 1 for September 6th', () => {
      expect(NFLWeek.forGame({ startTime: Date.parse(`${NFLWeek.seasonYear}-09-06`) }))
        .toEqual(1);
    });

    test('is 1 for September 11th', () => {
      expect(NFLWeek.forGame({ startTime: Date.parse(`${NFLWeek.seasonYear}-09-11`) }))
        .toEqual(1);
    });

    test('is 2 for September 12th', () => {
      expect(NFLWeek.forGame({ startTime: Date.parse(`${NFLWeek.seasonYear}-09-12`) }))
        .toEqual(2);
    });

    test('is 7 for October 17th', () => {
      expect(NFLWeek.forGame({ startTime: Date.parse(`${NFLWeek.seasonYear}-10-17`) }))
        .toEqual(7);
    });

    test('is 8 for October 24th', () => {
      expect(NFLWeek.forGame({ startTime: Date.parse(`${NFLWeek.seasonYear}-10-24`) }))
        .toEqual(8);
    });

    test('is 17 for December 31st', () => {
      expect(NFLWeek.forGame({ startTime: Date.parse(`${NFLWeek.seasonYear}-12-31`) }))
        .toEqual(17);
    });
  });
});
