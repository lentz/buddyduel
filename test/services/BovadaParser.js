const fs = require('fs');
require('../support');
const BovadaParser = require('../../services/BovadaParser');

describe('BovadaParser', function() {
  describe('#call()', function() {
    let bovadaJSON;

    before(function(done) {
      fs.readFile('./test/services/bovada-nfl.json', (err, body) => {
        if(err) return done(err);
        bovadaJSON = body;
        done();
      });
    });

    it('parses the JSON and returns game objects', function() {
      const games = BovadaParser.call(bovadaJSON);
      const expectedGames = [
        {
          id: '2782377',
          homeTeam: 'New England Patriots',
          homeSpread: -7.5,
          awayTeam: 'Kansas City Chiefs',
          awaySpread: 7.5,
          startTime: 1504830600000,
        },
        {
          id: '2782436',
          homeTeam: 'Chicago Bears',
          homeSpread: 6.5,
          awayTeam: 'Atlanta Falcons',
          awaySpread: -6.5,
          startTime: 1505062800000,
        },
        {
          id: '2782438',
          homeTeam: 'Washington Redskins',
          homeSpread: -2.5,
          awayTeam: 'Philadelphia Eagles',
          awaySpread: 2.5,
          startTime: 1505062800000,
        },
        {
          id: '2782443',
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
