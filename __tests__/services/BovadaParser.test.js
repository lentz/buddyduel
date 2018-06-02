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
          id: '9786cb6e2bd40d72915f9270e621c952',
          homeTeam: 'New England Patriots',
          homeSpread: -7.5,
          awayTeam: 'Kansas City Chiefs',
          awaySpread: 7.5,
          startTime: 1504830600000,
        },
        {
          id: 'b763198f3b5d357f4be301b21baf6796',
          homeTeam: 'Chicago Bears',
          homeSpread: 6.5,
          awayTeam: 'Atlanta Falcons',
          awaySpread: -6.5,
          startTime: 1505062800000,
        },
        {
          id: '67d108844e962ddaa5247503d22684c5',
          homeTeam: 'Washington Redskins',
          homeSpread: -2.5,
          awayTeam: 'Philadelphia Eagles',
          awaySpread: 2.5,
          startTime: 1505062800000,
        },
        {
          id: '37dfbfdd31d6d22a65f10ab055423238',
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
