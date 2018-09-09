const fs = require('fs');
const path = require('path');
const parseNFLScores = require('../../lib/parseNFLScores');

describe('NFLScoreParser', () => {
  beforeEach(() => expect.hasAssertions());

  const expectedResult = {
    scores: [
      {
        awayScore: 0,
        gameId: '7c97493e31aec6b4c65057b1d8717677',
        homeScore: 0,
        time: 'Q1 15:00',
      },
      {
        awayScore: 0,
        gameId: '993d3fdf872ba329efce3e3b873512c8',
        homeScore: 0,
        time: 'Q1 14:53',
      },
      {
        awayScore: 0,
        gameId: '8376278741ab9d1f33f6cec3fd453ad2',
        homeScore: 0,
        time: 'Suspended',
      },
      {
        awayScore: 0,
        gameId: '8f04650396d48179d0fe5ecf9f1fe611',
        homeScore: 0,
        time: 'Q1 15:00',
      },
      {
        awayScore: 0,
        gameId: 'a298bf45a005072bfb5524b2709e5ef1',
        homeScore: 0,
        time: 'Q1 15:00',
      },
      {
        awayScore: 0,
        gameId: '17b20dbb0c8193ce772a42385bfe26b1',
        homeScore: 0,
        time: 'Q1 14:56',
      },
      {
        awayScore: 0,
        gameId: '4063a98871f19f9795ca40adf8ba5547',
        homeScore: 0,
        time: 'Q1 14:55',
      },
      {
        awayScore: 12,
        gameId: 'e65fff0a423bbc19b1eed57c85d5b091',
        homeScore: 18,
        time: 'Final',
      },
    ],
    weekNum: 1,
    year: 2018,
  };

  test('parses the scores into game results', () => {
    const scoresJSON = fs.readFileSync(path.join(__dirname, '..', 'sample-data', 'nfl-scores.json'));

    expect(parseNFLScores(JSON.parse(scoresJSON))).toEqual(expectedResult);
  });
});
