/* eslint-disable no-param-reassign */

import betResult from '../lib/betResult';
import * as oddsApi from '../services/odds-api';
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
    if (!existingGame) {
      games.push(line);
    } else {
      existingGame.awayScore = line.awayScore;
      existingGame.homeScore = line.homeScore;
      existingGame.startTime = line.startTime;
      existingGame.result = betResult(existingGame);
      existingGame.time = line.time;
      if (unpickedAndNotBegun(existingGame)) {
        existingGame.homeSpread = line.homeSpread ?? existingGame.homeSpread;
        existingGame.awaySpread = line.awaySpread ?? existingGame.awaySpread;
      }
    }
  });
  return games;
}

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
    const description = sport.currentWeek();
    if (!description) {
      continue;
    }
    console.log(
      `Updating ${sport.name} ${sport.seasonYear} ${description} for duel ID ${duel.id}`,
    );
    const newGames = await oddsApi.getGames(sport);
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
    duelWeek.picker =
      duelWeek.picker ?? (await getPicker(duel, sport.seasonYear));
    duelWeek.games = updateGames(duelWeek.games, newGames);
    await duelWeek.save();
  }
}
