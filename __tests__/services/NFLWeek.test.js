const NFLWeek = require('../../services/NFLWeek');

describe('NFLWeek', () => {
  beforeEach(() => expect.hasAssertions());

  describe('#forGame()', () => {
    test('is 1 for September 6th', () => {
      expect(NFLWeek.forGame({ startTime: 1536192000000 })).toEqual(1);
    });

    test('is 1 for September 11th', () => {
      expect(NFLWeek.forGame({ startTime: 1536624000000 })).toEqual(1);
    });

    test('is 2 for September 12th', () => {
      expect(NFLWeek.forGame({ startTime: 1536710400000 })).toEqual(2);
    });

    test('is 7 for October 17th', () => {
      expect(NFLWeek.forGame({ startTime: 1539734400000 })).toEqual(7);
    });

    test('is 8 for October 24th', () => {
      expect(NFLWeek.forGame({ startTime: 1540339200000 })).toEqual(8);
    });

    test('is 17 for December 31st', () => {
      expect(NFLWeek.forGame({ startTime: 1546214400000 })).toEqual(17);
    });
  });
});
