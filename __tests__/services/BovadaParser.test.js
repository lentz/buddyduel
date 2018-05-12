const fs = require('fs');
const path = require('path');
const BovadaParser = require('../../services/BovadaParser');

describe('BovadaParser', () => {
  beforeEach(() => expect.hasAssertions());

  describe('#call()', () => {
    const bovadaJSON = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'sample-data', 'bovada-nfl.json')));

    test('parses the JSON and returns game objects', () => {
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

      expect(BovadaParser.call(bovadaJSON)).toEqual(expectedGames);
    });

    test('skips games that do not have pointspreads', () => {
      const badJSON = {
        items: [
          {
            type: 'NFL',
            itemList: [
              {
                description: 'Moneyline',
              },
            ],
          },
        ],
      };

      expect(BovadaParser.call(badJSON)).toEqual([]);
    });

    test('skips games that do not have outcomes', () => {
      const badJSON = {
        items: [
          {
            type: 'NFL',
            itemList: [
              {
                description: 'Point Spread',
              },
            ],
          },
        ],
      };

      expect(BovadaParser.call(badJSON)).toEqual([]);
    });
  });
});
