/* eslint-disable no-param-reassign, no-console */

import betResult from '../lib/betResult';
import { default as DuelWeek, IDuelWeek } from '../models/DuelWeek';
import { sports, ISport } from '../sports';
import * as bovada from './bovada';

function createTimeString(clock: bovada.ILiveScore['clock']) {
  if (
    clock.period === 'FINAL' ||
    (clock.period === '4Q' && clock.gameTime === '0:00')
  ) {
    return 'Final';
  }

  return `${clock.period} ${clock.gameTime}`;
}

async function updateScores(sport: ISport) {
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

    const duelWeeks = (await DuelWeek.find({
      'games.id': { $in: liveScores.map((score) => score.eventId) },
      skipped: false,
    }).exec()) as IDuelWeek[];

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

export function run() {
  sports.forEach(updateScores);
}
