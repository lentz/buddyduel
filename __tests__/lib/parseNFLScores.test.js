const fs = require('fs');
const path = require('path');
const parseNFLScores = require('../../lib/parseNFLScores');

describe('NFLScoreParser', () => {
  beforeEach(() => expect.hasAssertions());

  const expectedResult = {
    scores: [
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
