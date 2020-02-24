/* eslint no-param-reassign: 0, no-console: 0 */

const betResult = require('../lib/betResult');
const DuelWeek = require('../models/DuelWeek');
const { sports } = require('../sports');
const bovada = require('./bovada');

function createTimeString(clock) {
  return clock.period === 'FINAL' ? 'Final' : `${clock.period} ${clock.gameTime}`;
}

async function updateScores(sport) {
  try {
    const liveScores = await bovada.getLiveScores(sport);

    /* eslint-disable-next-line no-restricted-syntax */
    for (const score of liveScores) {
      await DuelWeek.updateMany(
        { 'games.id': score.eventId },
        {
          $set: {
            'games.$.homeScore': score.latestScore.home,
            'games.$.awayScore': score.latestScore.visitor,
            'games.$.time': createTimeString(score.clock),
          },
        },
      );
    }

    const duelWeeks = await DuelWeek.find({
      'games.id': { $in: liveScores.map(score => score.eventId) },
      skipped: false,
    }).exec();

    /* eslint-disable-next-line no-restricted-syntax */
    for (const duelWeek of duelWeeks) {
      duelWeek.games = duelWeek.games.map((game) => {
        game.result = betResult(game);
        return game;
      });
      await duelWeek.save();
    }
  } catch (err) {
    console.error(`Failed to update ${sport.name} scores:`, err.stack);
  }
}

module.exports.run = function run() {
  sports.forEach(updateScores);
};
