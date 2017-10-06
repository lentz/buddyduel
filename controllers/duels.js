const async = require('async');

const Duel = require('../models/Duel');
const DuelWeekUpdater = require('../services/DuelWeekUpdater');
const error = require('../lib/error');
const user = require('../services/user');

function alreadyInDuel(code, userId, cb) {
  Duel.findOne({ code, 'players.id': userId }, (err, duel) => {
    if (duel) { return cb(new Error(`User ${userId} already in Duel ${duel.id}`)); }
    return cb();
  });
}

module.exports.index = (req, res) => Duel
  .find({ 'players.id': req.user.sub }, (err, duels) => {
    if (err) { return error.send(res, err, 'Failed to find duels'); }
    return res.json(duels);
  });

module.exports.create = (req, res) => {
  async.waterfall([
    waterfall => user.getInfo(req.user.sub, waterfall),
    (userInfo, waterfall) => {
      Duel.create({
        players: [{ id: req.user.sub, name: userInfo.name }],
        status: 'pending',
        betAmount: req.body.betAmount,
      }, waterfall);
    },
  ], (err, duel) => {
    if (err) { return error.send(res, err, 'Failed to create duel'); }
    return res.status(201).json(duel);
  });
};

module.exports.accept = (req, res) => {
  const code = req.body.code.trim();
  async.waterfall([
    waterfall => alreadyInDuel(code, req.user.sub, waterfall),
    waterfall => user.getInfo(req.user.sub, waterfall),
    (userInfo, waterfall) => {
      Duel.findOneAndUpdate(
        { code },
        { status: 'active', $push: { players: { id: req.user.sub, name: userInfo.name } } },
        { new: true, runValidators: true },
        waterfall
      );
    },
    (duel, waterfall) => DuelWeekUpdater.call([duel], waterfall),
  ], (err) => {
    if (err) { return error.send(res, err, 'Failed to accept duel'); }
    return res.json({ message: 'Duel accepted!' });
  });
};

module.exports.delete = (req, res) => {
  Duel.findOneAndRemove({ _id: req.params.id, 'players.id': req.user.sub }, (err) => {
    if (err) { return error.send(res, err, 'Failed to delete duel'); }
    return res.json({ message: 'Duel deleted' });
  });
};
