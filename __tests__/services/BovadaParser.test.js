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
          id: 'e65fff0a423bbc19b1eed57c85d5b091',
          homeTeam: 'Philadelphia Eagles',
          homeSpread: -4,
          awayTeam: 'Atlanta Falcons',
          awaySpread: 4,
          startTime: 1536279600000,
        },
        {
          id: 'a298bf45a005072bfb5524b2709e5ef1',
          homeTeam: 'New England Patriots',
          homeSpread: -7,
          awayTeam: 'Houston Texans',
          awaySpread: 7,
          startTime: 1536512700000,
        },
        {
          id: '8f04650396d48179d0fe5ecf9f1fe611',
          homeTeam: 'Minnesota Vikings',
          homeSpread: -5.5,
          awayTeam: 'San Francisco 49ers',
          awaySpread: 5.5,
          startTime: 1536512700000,
        },
        {
          id: '4063a98871f19f9795ca40adf8ba5547',
          homeSpread: 3.5,
          homeTeam: 'New York Giants',
          awaySpread: -3.5,
          awayTeam: 'Jacksonville Jaguars',
          startTime: 1536512700000,
        },
        {
          id: '993d3fdf872ba329efce3e3b873512c8',
          homeSpread: -2.5,
          homeTeam: 'Indianapolis Colts',
          awaySpread: 2.5,
          awayTeam: 'Cincinnati Bengals',
          startTime: 1536512700000,
        },
        {
          id: '7c97493e31aec6b4c65057b1d8717677',
          homeSpread: 6,
          homeTeam: 'Cleveland Browns',
          awaySpread: -6,
          awayTeam: 'Pittsburgh Steelers',
          startTime: 1536512700000,
        },
        {
          id: '8376278741ab9d1f33f6cec3fd453ad2',
          homeSpread: 2,
          homeTeam: 'Miami Dolphins',
          awaySpread: -2,
          awayTeam: 'Tennessee Titans',
          startTime: 1536512700000,
        },
        {
          id: '764e14f7c584e13674ce448623265691',
          homeSpread: -3,
          homeTeam: 'Los Angeles Chargers',
          awaySpread: 3,
          awayTeam: 'Kansas City Chiefs',
          startTime: 1536523500000,
        },
        {
          id: '750e1ee3c0e8f886af6556d3ea33edc1',
          homeSpread: -2,
          homeTeam: 'Denver Broncos',
          awaySpread: 2,
          awayTeam: 'Seattle Seahawks',
          startTime: 1536524700000,
        },
        {
          id: '3f62be65c6868e8a02802600e59578c2',
          homeSpread: -2.5,
          homeTeam: 'Carolina Panthers',
          awaySpread: 2.5,
          awayTeam: 'Dallas Cowboys',
          startTime: 1536524700000,
        },
        {
          id: 'dcf982545250d3bfee0e30adbf2978ac',
          homeSpread: 0,
          homeTeam: 'Arizona Cardinals',
          awaySpread: 0,
          awayTeam: 'Washington Redskins',
          startTime: 1536524700000,
        },
        {
          id: '21b825a00c844bd88eeb07bac5a37148',
          homeSpread: -8,
          homeTeam: 'Green Bay Packers',
          awaySpread: 8,
          awayTeam: 'Chicago Bears',
          startTime: 1536538800000,
        },
        {
          id: '14d83d382a8d8bc060777a8107e1562d',
          homeSpread: -7,
          homeTeam: 'Detroit Lions',
          awaySpread: 7,
          awayTeam: 'New York Jets',
          startTime: 1536621000000,
        },
        {
          id: 'b0a2e6187e0f8df5ef1790b1f90f4e83',
          homeSpread: 3,
          homeTeam: 'Oakland Raiders',
          awaySpread: -3,
          awayTeam: 'Los Angeles Rams',
          startTime: 1536632400000,
        },
      ];

      expect(BovadaParser.call(bovadaJSON)).toEqual(expectedGames);
    });
  });
});
