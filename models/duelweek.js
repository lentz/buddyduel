const ObjectID = require('mongodb').ObjectID;
const User = require('./user');
const db = require('../db');

const colName = 'duelweeks';

module.exports.find = id => db.get().collection(colName).findOne({
  _id: new ObjectID(id),
  'players.id': User.current().id,
});

module.exports.forDuel = duelId => db.get().collection(colName)
  .find({ duelId, 'players.id': User.current().id }).toArray();

module.exports.create = duelWeek => db.get().collection(colName).insertOne(duelWeek);

module.exports.updatePicks = (id, games) => db.get().collection(colName)
  .updateOne(
  { _id: new ObjectID(id), 'players.id': User.current().id },
  {
    $currentDate: { updatedAt: true },
    $set: { games },
  });
