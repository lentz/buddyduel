const fs = require('fs');
const path = require('path');
const BovadaParser = require('../../services/BovadaParser');

describe('BovadaParser', () => {
  describe('#call()', () => {
    const bovadaJSON = JSON.parse(fs.readFileSync(path.join(
      __dirname, '..', 'sample-data', 'bovada-nfl.json',
    )));

    test('parses the JSON and returns game objects', () => {
      expect(BovadaParser.call(bovadaJSON)).toMatchSnapshot();
    });
  });
});
