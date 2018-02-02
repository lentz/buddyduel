/* eslint no-param-reassign: "off" */

const _ = require('lodash');
const bovada = require('../services/bovada');
const DuelWeek = require('../models/DuelWeek');
const NFLWeek = require('../services/NFLWeek');

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

function picker(players, weekNum) {
  // This is gross, but need to handle the Pro Bowl week
  const pickerWeekNum = weekNum === '22' ? 21 : parseInt(weekNum, 10);
  return players[pickerWeekNum % 2];
}

module.exports.call = async (duels) => {
  const lines = await bovada.getLines();
  const weekMap = _.groupBy(lines, NFLWeek.forGame);
  // TODO: Refactor this to be simpler
  return Promise.all(duels.map(async (duel) => { // eslint-disable-line arrow-body-style
    return Promise.all(Object.keys(weekMap).map(async (weekNum) => {
      const duelWeek = await DuelWeek.findOneAndUpdate(
        { year: NFLWeek.seasonYear, weekNum, duelId: duel.id },
        {
          betAmount: duel.betAmount,
          players: duel.players,
          picker: picker(duel.players, weekNum),
        },
        {
          upsert: true, setDefaultsOnInsert: true, runValidators: true, new: true,
        }
      ).exec();
      duelWeek.games = updateGames(duelWeek.games, weekMap[weekNum]);
      return duelWeek.save();
    }));
  }));
};
