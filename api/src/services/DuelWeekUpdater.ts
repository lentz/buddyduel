/* eslint-disable no-param-reassign */

import { groupBy } from 'lodash';
import * as bovada from '../services/bovada';
import { getGameWeek, sports } from '../sports';
import { default as DuelWeek, IDuelWeek } from '../models/DuelWeek';
import IGame from '../models/IGame';
import { IDuel } from '../models/Duel';

function unpickedAndNotBegun(game: IGame) {
  return !game.selectedTeam && game.startTime > +new Date();
}

function updateGames(games: IGame[], lines: IGame[]) {
  lines.forEach((line) => {
    const existingGame = games.find(game => line.id === game.id);
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

function picker(duel: IDuel, weekNum: string) {
  // This is gross, but need to handle the Pro Bowl week
  const pickerWeekNum = duel.sport === 'NFL' && weekNum === '22' ? 21 : parseInt(weekNum, 10);
  return duel.players[pickerWeekNum % 2];
}

export async function call(duels: IDuel[]) {
  // TODO: Refactor this to be simpler
  return Promise.all(duels.map(async (duel) => {
    const sport = sports.find(s => s.name === duel.sport);
    if (!sport) { return; }
    const games = await bovada.getPreMatchLines(sport);
    const weekMap = groupBy(games, (game: IGame) => getGameWeek(game, sport));
    return Promise.all(Object.keys(weekMap).map(async (weekNum) => {
      const duelWeek = await DuelWeek.findOneAndUpdate(
        { year: sport.seasonYear, weekNum, duelId: duel.id },
        {
          betAmount: duel.betAmount,
          picker: picker(duel, weekNum),
          players: duel.players,
          sport: duel.sport,
        },
        {
          upsert: true, setDefaultsOnInsert: true, runValidators: true, new: true,
        }
      ).exec() as IDuelWeek;
      duelWeek.games = updateGames(duelWeek.games, weekMap[weekNum]);
      return duelWeek.save();
    }));
  }));
}
