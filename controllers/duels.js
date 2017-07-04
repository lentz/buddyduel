const error = require('../lib/error');
const Duel = require('../models/duel');

module.exports.index = (req, res) => {
  Duel.forUser(req.user.sub, req.query.status, (err, duels) => {
    if (err) { error.send(res, err, 'Failed to find duels'); }
    res.json(duels);
  });
};

module.exports.create = (req, res) => {
  Duel.create([{ id: req.user.sub }])
  .then(duel => res.status(201).json(duel))
  .catch(err => error.send(res, err, 'Failed to create duel'));
};

module.exports.accept = (req, res) => {
  Duel.accept(req.params.id.trim(), { id: req.user.sub })
  .then((result) => {
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Duel not found' });
    }
    return res.json({ message: 'Duel accepted!' });
  })
  .catch(err => error.send(res, err, 'Failed to accept duel'));
};
