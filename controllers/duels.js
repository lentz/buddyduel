const error = require('../lib/error');
const User = require('../models/user');
const Duel = require('../models/duel');

module.exports.index = (req, res) => {
  Duel.activeForUser(User.current().id)
  .then(duels => res.json(duels))
  .catch(err => error.send(res, err, 'Failed to find duels'));
};

module.exports.create = (req, res) => {
  Duel.create([User.current()])
  .then(duel => res.status(201).json(duel))
  .catch(err => error.send(res, err, 'Failed to create duel'));
};
