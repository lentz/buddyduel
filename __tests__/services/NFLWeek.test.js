const NFLWeek = require('../../services/NFLWeek');

describe('NFLWeek', () => {
  beforeEach(() => expect.hasAssertions());

  describe('#forGame()', () => {
    test('is 1 for September 7th', () => {
      expect(NFLWeek.forGame({ startTime: 1504785600000 })).toEqual(1);
    });

    test('is 1 for September 11th', () => {
      expect(NFLWeek.forGame({ startTime: 1505131200000 })).toEqual(1);
    });

    test('is 2 for September 14th', () => {
      expect(NFLWeek.forGame({ startTime: 1505390400000 })).toEqual(2);
    });

    test('is 7 for October 23rd', () => {
      expect(NFLWeek.forGame({ startTime: 1508760000000 })).toEqual(7);
    });

    test('is 8 for October 24th', () => {
      expect(NFLWeek.forGame({ startTime: 1508828460000 })).toEqual(8);
    });

    test('is 17 for December 31st', () => {
      expect(NFLWeek.forGame({ startTime: 1514721600000 })).toEqual(17);
    });
  });
});
