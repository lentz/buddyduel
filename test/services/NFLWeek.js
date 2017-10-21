/* global assert */

require('../support');
const NFLWeek = require('../../services/NFLWeek');

describe('NFLWeek', () => {
  describe('#forGame()', () => {
    it('is 1 for September 7th', () => {
      assert.equal(1, NFLWeek.forGame({ startTime: 1504785600000 }));
    });

    it('is 1 for September 11th', () => {
      assert.equal(1, NFLWeek.forGame({ startTime: 1505131200000 }));
    });

    it('is 2 for September 14th', () => {
      assert.equal(2, NFLWeek.forGame({ startTime: 1505390400000 }));
    });

    it('is 7 for October 23rd', () => {
      assert.equal(7, NFLWeek.forGame({ startTime: 1508760000000 }));
    });

    it('is 8 for October 24th', () => {
      assert.equal(8, NFLWeek.forGame({ startTime: 1508828460000 }));
    });

    it('is 17 for December 31st', () => {
      assert.equal(17, NFLWeek.forGame({ startTime: 1514721600000 }));
    });
  });
});
