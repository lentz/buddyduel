/* eslint no-param-reassign: 0 */

require('dotenv').config();
const db = require('../db');
const ObjectID = require('mongodb').ObjectID;

function betResult(game) {
  const homeResult = game.homeScore + game.homeSpread;
  const awayResult = game.awayScore + game.awaySpread;

  if (!game.selectedTeam) { return 'Loss'; }
  if (homeResult === game.awayScore) { return 'Push'; }
  if ((game.selectedTeam === game.awayTeam && awayResult > game.homeScore) ||
     (game.selectedTeam === game.homeTeam && homeResult > game.awayScore)) {
    return 'Win';
  }
  return 'Loss';
}

function updateScores(err, duelWeeks) {
  if (err) { throw err; }
  duelWeeks.forEach((duelWeek) => {
    db.get().collection('results').findOne(
      { year: duelWeek.year, weekNum: duelWeek.weekNum }
      , (resultErr, weekResult) => {
        if (resultErr) { throw resultErr; }
        const updatedGames = duelWeek.games.map((game) => {
          const gameResult = weekResult.scores.find(score => score.gameId === game.id);
          if (gameResult) {
            game.awayScore = gameResult.awayScore;
            game.homeScore = gameResult.homeScore;
            game.result = betResult(game);
          }
          return game;
        });
        db.get().collection('duelweeks').updateOne(
          { _id: new ObjectID(duelWeek._id) },
          { $set: { games: updatedGames } },
          (updateErr) => {
            if (updateErr) { throw updateErr; }
            process.exit();
          });
      });
  });
}

db.connect(process.env.MONGODB_URI, (err) => {
  if (err) { throw err; }
  db.get().collection('duelweeks').find({ 'games.result': null }).toArray(updateScores);
});
