/* eslint-disable no-param-reassign */

import * as oddsApi from '../services/odds-api.js';
import { sports } from '../sports.js';
import { default as DuelWeek, IDuelWeek } from '../models/DuelWeek.js';
import { IDuel } from '../models/Duel.js';

async function getPicker(duel: IDuel, year: number) {
  const duelWeekCount = await DuelWeek.countDocuments({
    duelId: duel.id,
    year,
  }).exec();
  return duel.players[duelWeekCount % 2];
}

export async function call(duels: IDuel[]) {
  for (const duel of duels) {
    const sport = sports.find((s) => s.name === duel.sport);
    if (!sport) {
      continue;
    }
    const { description } = sport.currentWeek();
    if (!description) {
      continue;
    }
    console.log(
      `Updating ${sport.name} ${sport.seasonYear} ${description} for duel ID ${duel.id}`,
    );
    const duelWeek = (await DuelWeek.findOneAndUpdate(
      { year: sport.seasonYear, description, duelId: duel.id },
      {
        betAmount: duel.betAmount,
        players: duel.players,
        sport: duel.sport,
      },
      {
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true,
        new: true,
      },
    ).exec()) as IDuelWeek;

    duelWeek.picker ??= await getPicker(duel, sport.seasonYear);

    await oddsApi.updateOdds(duelWeek.games, sport);

    const gamesHaveStarted = duelWeek.games.some(
      (game) => new Date() > game.startTime,
    );
    if (gamesHaveStarted) {
      await oddsApi.updateScores(duelWeek.games, sport);
    }

    await duelWeek.save();
  }
}
