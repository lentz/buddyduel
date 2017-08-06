const async = require('async');

const Duel = require('../models/duel');
const error = require('../lib/error');
const user = require('../services/user');

function alreadyInDuel(duelId, userId, cb) {
  Duel.forUser(userId, 'pending', (err, duels) => {
    if (duels.map(duel => duel._id.toString()).includes(duelId)) {
      return cb(new Error('You are already in this duel'));
    }
    return cb();
  });
}

module.exports.index = (req, res) => {
  Duel.forUser(req.user.sub, req.query.status, (err, duels) => {
    if (err) { error.send(res, err, 'Failed to find duels'); }
    res.json(duels);
  });
};

module.exports.create = (req, res) => {
  async.waterfall([
    waterfall => user.getInfo(req.user.sub, waterfall),
    (userInfo, waterfall) => {
      Duel.create({ id: req.user.sub, name: userInfo.name }, waterfall);
    },
  ], (err, duel) => {
    if (err) { return error.send(res, err, 'Failed to create duel'); }
    return res.status(201).json(duel);
  });
};

module.exports.accept = (req, res) => {
  const duelId = req.params.id.trim();
  async.waterfall([
    waterfall => alreadyInDuel(duelId, req.user.sub, waterfall),
    waterfall => user.getInfo(req.user.sub, waterfall),
    (userInfo, waterfall) => {
      Duel.accept(
        duelId,
        { id: req.user.sub, name: userInfo.name },
        waterfall
      );
    },
  ], (err, result) => {
    if (err) { return error.send(res, err, 'Failed to accept duel'); }
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Duel not found' });
    }
    return res.json({ message: 'Duel accepted!' });
  });
};
