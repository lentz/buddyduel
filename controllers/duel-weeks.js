/* eslint no-param-reassign: "off" */

const error = require('../lib/error');
const bovada = require('../services/bovada');
const User = require('../models/user');
const Duel = require('../models/duel');
const DuelWeek = require('../models/duelweek.js');

function updateLines(duelWeek) {
  if (duelWeek.games.every(game => game.selectedTeam)) {
    return Promise.resolve(duelWeek);
  }

  return bovada.getLines().then((lines) => {
    duelWeek.games.filter(game => !game.selectedTeam).forEach((game) => {
      const currentGameLine = lines.find(line => line.id === game.id);
      if (currentGameLine) {
        game.homeSpread = currentGameLine.homeSpread;
        game.awaySpread = currentGameLine.awaySpread;
      }
    });
    return Promise.resolve(duelWeek);
  });
}

module.exports.index = (req, res) => {
  DuelWeek.forDuel(req.query.duelId)
  .then((duelWeeks) => {
    if (duelWeeks.length === 0) {
      return res.redirect(`duel-weeks/new?duelId=${req.query.duelId}`);
    }
    return res.json(duelWeeks.map(duelWeek => duelWeek._id));
  })
  .catch(err => error.send(res, err, 'Failed to retrieve duel weeks'));
};

module.exports.new = (req, res) => {
  let players;
  Duel.find(req.query.duelId)
  .then((result) => {
    if (!result) throw new Error('Cannot create duel week - duel not found');
    players = result.players;
    return bovada.getLines();
  })
  .then(lines => DuelWeek.create({
    duelId: req.query.duelId,
    players,
    picker: User.current().id, // TODO: Determine picker
    games: lines,
    updatedAt: new Date(),
  }))
  .then(result => res.status(201).json([result.insertedId]))
  .catch(err => error.send(res, err, 'Failed to create new duel week'));
};

module.exports.show = (req, res) => {
  DuelWeek.find(req.params.id)
  .then((duelWeek) => {
    if (!duelWeek) return Promise.resolve(null);
    return updateLines(duelWeek);
  })
  .then((duelWeek) => {
    if (!duelWeek) return res.status(404).json({ message: 'Duel week not found' });
    return res.json(duelWeek);
  })
  .catch(err => error.send(res, err, 'Failed to display duel week'));
};

module.exports.update = (req, res) => {
  DuelWeek.updatePicks(req.body._id, req.body.games)
  .then((result) => {
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Duel week not found' });
    }
    return res.json({ message: 'Picks successfully locked in' });
  })
  .catch(err => error.send(res, err, 'Failed to update duel week'));
};
