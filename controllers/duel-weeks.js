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

module.exports.index = (req, res) => {
  async.waterfall([
    async.asyncify(bovada.getLines),
    (lines, waterfall) => {
      const weekMap = _.groupBy(lines, NFLWeek.forGame);
      async.map(Object.keys(weekMap), (weekNum, cb) => {
        DuelWeek.findOrNew(NFLWeek.seasonYear, weekNum, req.query.duelId, (err, duelWeek) => {
          duelWeek.games = updateGames(duelWeek.games, weekMap[weekNum]);
          cb(null, duelWeek);
        });
      }, waterfall);
    },
    (duelWeeks, waterfall) => async.map(duelWeeks, DuelWeek.save, waterfall),
  ], (err, results) => {
    if (err) { return error.send(res, err, 'Failed to get duel weeks'); }
    return res.json(results.map(
      result => (_.get(result, 'lastErrorObject.upserted') || _.get(result, 'value._id')),
    ));
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
    return DuelWeek.updatePicks(req.body._id, req.body.games, (updateErr) => {
      if (updateErr) { return error.send(res, updateErr, 'Failed to update duel week'); }
      return res.json({ message: 'Picks successfully locked in' });
    });
  });
};
