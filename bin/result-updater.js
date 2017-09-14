/* eslint no-param-reassign: 0 */

require('dotenv').config();
const db = require('../db');
const ObjectID = require('mongodb').ObjectID;
const betResult = require('../lib/betResult');

function updateScores(err, duelWeeks) {
  if (err) { throw err; }
  duelWeeks.forEach((duelWeek) => {
    db.get().collection('results').findOne(
      { year: duelWeek.year, weekNum: duelWeek.weekNum }
      , (resultErr, weekResult) => {
        if (resultErr) {
          console.error(`Error finding result for duel week: ${resultErr}`); // eslint-disable-line no-console
          return;
        }
        if (!weekResult) { return; }
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
  // TODO: Scope down games needing update
  db.get().collection('duelweeks').find({}).toArray(updateScores);
});
