/* eslint no-param-reassign: "off" */

const _ = require('lodash');
const async = require('async');
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

module.exports.call = (duels, cb) => {
  bovada.getLines((err, lines) => {
    if (err) { return cb(err); }
    const weekMap = _.groupBy(lines, NFLWeek.forGame);
    return async.each(duels, (duel, eachDuelCb) => {
      async.each(Object.keys(weekMap), (weekNum, eachWeekCb) => {
        DuelWeek.findOneAndUpdate(
          { year: NFLWeek.seasonYear, weekNum, duelId: duel.id },
          {
            betAmount: duel.betAmount,
            players: duel.players,
            picker: duel.players[weekNum % 2],
          },
          { upsert: true, setDefaultsOnInsert: true, runValidators: true, new: true },
          (findErr, duelWeek) => {
            if (findErr) { return eachWeekCb(findErr); }
            duelWeek.games = updateGames(duelWeek.games, weekMap[weekNum]);
            return duelWeek.save(eachWeekCb);
          }
        );
      }, eachDuelCb);
    }, cb);
  });
};
