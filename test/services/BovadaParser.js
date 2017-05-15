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

    it('parses the JSON and returns matchup objects', function() {
      const matchups = BovadaParser.call(bovadaJSON);
      assert.ok(matchups);
    });
  });
});
