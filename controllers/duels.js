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

module.exports.accept = (req, res) => {
  Duel.accept(req.params.id, User.second())
  .then((result) => {
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Unable to accept this duel' });
    }
    return res.json({ message: 'Duel accepted!' });
  })
  .catch(err => error.send(res, err, 'Failed to update duel'));
};
