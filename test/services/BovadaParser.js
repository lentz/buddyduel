/* global assert */

const fs = require('fs');
require('../support');
const BovadaParser = require('../../services/BovadaParser');

describe('BovadaParser', () => {
  describe('#call()', () => {
    let bovadaJSON;

    before((done) => {
      fs.readFile('./test/services/bovada-nfl.json', (err, body) => {
        if (err) return done(err);
        bovadaJSON = body;
        return done();
      });
    });

    it('parses the JSON and returns game objects', () => {
      const games = BovadaParser.call(bovadaJSON);
      const expectedGames = [
        {
          id: '0aba1f49b217ba4626b1838fe2f276de',
          homeTeam: 'New England Patriots',
          homeSpread: -7.5,
          awayTeam: 'Kansas City Chiefs',
          awaySpread: 7.5,
          startTime: 1504830600000,
        },
        {
          id: '0fb0aa10c6e32da7d8bccc14cc993ff8',
          homeTeam: 'Chicago Bears',
          homeSpread: 6.5,
          awayTeam: 'Atlanta Falcons',
          awaySpread: -6.5,
          startTime: 1505062800000,
        },
        {
          id: 'f47d0c71f788349c92fba30c20a2f496',
          homeTeam: 'Washington Redskins',
          homeSpread: -2.5,
          awayTeam: 'Philadelphia Eagles',
          awaySpread: 2.5,
          startTime: 1505062800000,
        },
        {
          id: '9fc396c0c44acb6e8ca8df5631d874ab',
          homeTeam: 'Cleveland Browns',
          homeSpread: 9,
          awayTeam: 'Pittsburgh Steelers',
          awaySpread: -9,
          startTime: 1505062800000,
        },
      ];
      assert.deepEqual(games, expectedGames);
    });
  });
});
