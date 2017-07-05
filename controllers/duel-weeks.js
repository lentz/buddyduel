/* eslint no-param-reassign: "off" */

const _ = require('lodash');
const async = require('async');
const error = require('../lib/error');
const bovada = require('../services/bovada');
const Duel = require('../models/duel');
const DuelWeek = require('../models/duelweek');
const NFLWeek = require('../services/NFLWeek');

function updateGames(games, lines) {
  lines.forEach((line) => {
    const existingGame = games.find(game => line.id === game.id);
    if (existingGame === undefined) {
      games.push(line);
    } else if (!existingGame.selectedTeam) {
      existingGame.homeSpread = line.homeSpread;
      existingGame.awaySpread = line.awaySpread;
    }
  });
  return games;
}

function syncDuelWeeks(duel, syncCallback) {
  async.waterfall([
    bovada.getLines,
    (lines, waterfall) => {
      const weekMap = _.groupBy(lines, NFLWeek.forGame);
      async.map(Object.keys(weekMap), (weekNum, mapCallback) => {
        DuelWeek.findOrNew(NFLWeek.seasonYear, weekNum, duel._id.toString(), (err, duelWeek) => {
          duelWeek.games = updateGames(duelWeek.games, weekMap[weekNum]);
          mapCallback(null, duelWeek);
        });
      }, waterfall);
    },
    (duelWeeks, waterfall) => async.map(duelWeeks, DuelWeek.save, waterfall),
  ], syncCallback);
}

module.exports.index = (req, res) => {
  async.waterfall([
    waterfall => Duel.forUser(req.user.sub, 'active', waterfall),
    (duels, waterfall) => async.map(duels, syncDuelWeeks, waterfall),
  ], (err, duelWeeksMap) => {
    if (err) { return error.send(res, err, 'Unable to list duel weeks'); }
    return res.json(_.flatten(duelWeeksMap));
  });
};

module.exports.show = (req, res) => {
  async.parallel([
    parallel => DuelWeek.find(req.params.id, parallel),
    parallel => Duel.forUser(req.user.sub, 'active', parallel),
  ], (err, results) => {
    if (err) { return error.send(res, err, 'Failed to display duel week'); }
    const duelWeek = results[0];
    const duels = results[1];
    if (!duels.map(duel => duel._id.toString()).includes(duelWeek.duelId)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    return res.json(duelWeek);
  });
};

function setSelections(duelWeek, pickedGames) {
  return duelWeek.games.map((game) => {
    const currentGame = pickedGames.find(pickedGame => pickedGame.id === game.id);
    if (currentGame) { game.selectedTeam = currentGame.selectedTeam; }
    return game;
  });
}

module.exports.update = (req, res) => {
  async.parallel([
    parallel => DuelWeek.find(req.body._id, parallel),
    parallel => Duel.forUser(req.user.sub, 'active', parallel),
  ], (err, results) => {
    if (err) { return error.send(res, err, 'Failed to authorize update'); }
    const duelWeek = results[0];
    const duels = results[1];
    if (!duels.map(duel => duel._id.toString()).includes(duelWeek.duelId)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const updatedGames = setSelections(duelWeek, req.body.games);
    return DuelWeek.updatePicks(req.body._id, updatedGames, (updateErr) => {
      if (updateErr) { return error.send(res, updateErr, 'Failed to update duel week'); }
      return res.json({ message: 'Picks successfully locked in' });
    });
  });
};
