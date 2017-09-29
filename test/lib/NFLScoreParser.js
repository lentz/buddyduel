/* global assert */

const fs = require('fs');
require('../support');
const NFLScoreParser = require('../../lib/NFLScoreParser');

describe('NFLScoreParser', () => {
  describe('#parseXML()', () => {
    const expectedResult = {
      scores: [
        {
          gameId: '6151445c4bc80660b6826c078f8cd5d5',
          homeScore: 9,
          awayScore: 10,
          time: '4Q 07:01',
        },
        {
          gameId: '821a0f85ee7089133350b204ec01e5bd',
          homeScore: 24,
          awayScore: 14,
          time: 'Final',
        },
        {
          gameId: '44c379c456ca47f7a4c2c4f3d71fa656',
          homeScore: 7,
          awayScore: 3,
          time: 'Final',
        },
        {
          gameId: '31b02226c37763f96768a7ecb92fafeb',
          homeScore: 13,
          awayScore: 7,
          time: 'Half',
        },
        {
          gameId: '9f76cee41626238e38947f44e728333c',
          homeScore: 0,
          awayScore: 0,
          time: 'Suspended',
        },
      ],
      weekNum: 2,
      year: 2017,
    };

    it('parses the XML scores into JSON game results', (done) => {
      fs.readFile('./test/lib/nfl-scores.xml', (err, scoresXML) => {
        if (err) { return done(err); }
        return NFLScoreParser.parseXML(scoresXML, (parseErr, gameResults) => {
          if (parseErr) { return done(parseErr); }
          assert.deepEqual(gameResults, expectedResult);
          return done();
        });
      });
    });
  });
});
