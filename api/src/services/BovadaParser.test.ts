import { readFileSync } from 'fs';
import { join } from 'path';
import * as BovadaParser from './BovadaParser';

describe('BovadaParser', () => {
  describe('#parseGames()', () => {
    const bovadaJSON = JSON.parse(readFileSync(join(
      __dirname, '..', '..', '__tests__', 'sample-data', 'bovada-nfl.json',
    )).toString());

    test('parses the JSON and returns game objects', () => {
      expect(BovadaParser.parseGames(bovadaJSON)).toMatchSnapshot();
    });
  });
});
