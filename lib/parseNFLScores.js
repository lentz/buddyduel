const titleCase = require('title-case');
const createGameId = require('./createGameId');

function generateTimeString(score) {
  if (/Q\d/i.test(score.phase)) {
    return `${score.phase} ${score.time}`;
  }

  return titleCase(score.phase);
}

module.exports = (scoresJSON) => {
  const year = scoresJSON.season;
  const weekNum = scoresJSON.week;
  const scores = scoresJSON.gameScores
    .filter(game => game.score)
    .filter(game => game.score.phase !== 'PREGAME')
    .map(game => ({
      gameId: createGameId(
        game.gameSchedule.homeDisplayName,
        game.gameSchedule.visitorDisplayName,
        year,
        weekNum,
      ),
      homeScore: game.score.homeTeamScore.pointTotal,
      awayScore: game.score.visitorTeamScore.pointTotal,
      time: generateTimeString(game.score),
    }));

  return { year, weekNum, scores };
};
