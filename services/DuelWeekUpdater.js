/* eslint no-param-reassign: "off" */

const _ = require('lodash');
const async = require('async');
const bovada = require('../services/bovada');
const DuelWeek = require('../models/duelweek');
const NFLWeek = require('../services/NFLWeek');

function updateGames(games, lines) {
  lines.forEach((line) => {
    const existingGame = games.find(game => line.id === game.id);
    if (existingGame === undefined) {
      games.push(line);
    } else if (!existingGame.selectedTeam && existingGame.startTime > +new Date()) {
      existingGame.homeSpread = line.homeSpread;
      existingGame.awaySpread = line.awaySpread;
    }
  });
  return games;
}

module.exports.call = (duels, cb) => {
  bovada.getLines((err, lines) => {
    const weekMap = _.groupBy(lines, NFLWeek.forGame);
    async.each(duels, (duel, eachDuelCb) => {
      async.each(Object.keys(weekMap), (weekNum, eachWeekCb) => {
        DuelWeek.findOrNew(NFLWeek.seasonYear, weekNum, duel, (findErr, duelWeek) => {
          duelWeek.games = updateGames(duelWeek.games, weekMap[weekNum]);
          DuelWeek.save(duelWeek, eachWeekCb);
        });
      }, eachDuelCb);
    }, cb);
  });
};
