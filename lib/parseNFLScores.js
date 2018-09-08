const createGameId = require('./createGameId');

function generateTimeString(score) {
  switch (score.phaseDescription) {
    case 'FINAL':
      return 'Final';
    case 'HALF':
      return 'Half';
    default:
      return `${score.phase}Q ${score.time}`;
  }
}

module.exports = (scoresJSON) => {
  const year = scoresJSON.season;
  const weekNum = scoresJSON.week;
  const scores = scoresJSON.gameScores
    .filter(game => game.score)
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
