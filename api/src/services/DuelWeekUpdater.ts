/* eslint-disable no-param-reassign */

import { groupBy } from 'lodash';
import * as bovada from '../services/bovada';
import { sports } from '../sports';
import { default as DuelWeek, IDuelWeek } from '../models/DuelWeek';
import IGame from '../models/IGame';
import { IDuel } from '../models/Duel';

function unpickedAndNotBegun(game: IGame) {
  return !game.selectedTeam && game.startTime > new Date();
}

function updateGames(games: IGame[], lines: IGame[]) {
  lines.forEach((line) => {
    const existingGame = games.find((game) => line.id === game.id);
    if (existingGame === undefined) {
      games.push(line);
    } else {
      existingGame.startTime = line.startTime;
      if (unpickedAndNotBegun(existingGame)) {
        existingGame.homeSpread = line.homeSpread;
        existingGame.awaySpread = line.awaySpread;
      }
    }
  });
  return games;
}

async function getPicker(duel: IDuel) {
  const duelWeekCount = await DuelWeek.countDocuments({
    duelId: duel.id,
  }).exec();
  return duel.players[duelWeekCount % 2];
}

export async function call(duels: IDuel[]) {
  for (const duel of duels) {
    const sport = sports.find((s) => s.name === duel.sport);
    if (!sport) {
      continue;
    }
    const games = await bovada.getPreMatchLines(sport);
    const weekMap = groupBy(games, (game: IGame) =>
      sport.getWeekDescription(game),
    );
    for (const [description, newGames] of Object.entries(weekMap)) {
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
      duelWeek.picker = duelWeek.picker || (await getPicker(duel));
      duelWeek.games = updateGames(duelWeek.games, newGames);
      await duelWeek.save();
    }
  }
}
