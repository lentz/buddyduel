/* eslint no-param-reassign: "off" */

const logger = require('winston');
const ObjectID = require('mongodb').ObjectID;
const db = require('../db');
const bovada = require('../lib/bovada');
const user = require('../lib/user');

const colName = 'duelweeks';

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

function handleError(res, err, message) {
  logger.error(err);
  res.status(500).json({ message });
}

module.exports.index = (req, res) => {
  //FIXME: Remove
  const opponentId = 3;
  const col = db.get().collection(colName);
  col.find({ players: { $all: [user.current().id, opponentId] } }, { _id: true })
     .toArray().then((results) => {
       if (results.length === 0) return res.redirect('duel-weeks/new');
       return res.json(results.map(result => result._id));
     })
    .catch(err => handleError(res, err, 'Failed retrieve duel weeks'));
};

module.exports.new = (req, res) => {
  //FIXME: Remove
  const opponentId = 3;
  bovada.getLines().then((lines) => {
    const col = db.get().collection(colName);
    return col.insertOne({
      players: [user.current().id, opponentId],
      games: lines,
    });
  })
  .then(result => res.json([result.insertedId]))
  .catch(err => handleError(res, err, 'Failed to create new duel week'));
};

module.exports.show = (req, res) => {
  const col = db.get().collection(colName);
  col.findOne({ _id: new ObjectID(req.params.id), players: user.current().id })
     .then((duelWeek) => {
       if (!duelWeek) return Promise.resolve(null);
       return updateLines(duelWeek);
     })
     .then((duelWeek) => {
       if (!duelWeek) return res.status(404).json({ message: 'Duel week not found' });
       return res.json(duelWeek);
     })
     .catch(err => handleError(res, err, 'Failed to display duel week'));
};

module.exports.update = (req, res) => {
  const col = db.get().collection(colName);
  col.updateOne(
    { _id: new ObjectID(req.body._id), players: user.current().id },
    { $set: { games: req.body.games } },
    (err, result) => {
      if (err) return handleError(res, err, 'Failed to update duel week');
      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'Duel week not found' });
      }
      return res.json({ message: 'Picks successfully locked in' });
    });
};
