/* eslint no-param-reassign: "off" */

const _ = require('lodash');
const bovada = require('../services/bovada');
const { getGameWeek, sports } = require('../sports');
const DuelWeek = require('../models/DuelWeek');

function unpickedAndNotBegun(game) {
  return !game.selectedTeam && game.startTime > +new Date();
}

function updateGames(games, lines) {
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

function picker(duel, weekNum) {
  // This is gross, but need to handle the Pro Bowl week
  const pickerWeekNum = duel.sport === 'NFL' && weekNum === '22' ? 21 : parseInt(weekNum, 10);
  return duel.players[pickerWeekNum % 2];
}

async function call(duels) {
  // TODO: Refactor this to be simpler
  return Promise.all(duels.map(async (duel) => { // eslint-disable-line arrow-body-style
    const sport = sports.find(s => s.name === duel.sport);
    const games = await bovada.getPreMatchLines(sport);
    const weekMap = _.groupBy(games, game => getGameWeek(game, sport));
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
      ).exec();
      duelWeek.games = updateGames(duelWeek.games, weekMap[weekNum]);
      return duelWeek.save();
    }));
  }));
}

module.exports.call = call;
