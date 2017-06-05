const ObjectID = require('mongodb').ObjectID;
const db = require('../db');

const colName = 'duelweeks';

module.exports.find = (id, userId) => db.get().collection(colName).findOne({
  _id: new ObjectID(id),
  'players.id': userId,
});

module.exports.forDuel = (duelId, userId) => db.get().collection(colName)
  .find({ duelId, 'players.id': userId }).toArray();

module.exports.create = duelWeek => db.get().collection(colName).insertOne(duelWeek);

module.exports.updatePicks = (id, userId, games) => db.get().collection(colName)
  .updateOne(
  { _id: new ObjectID(id), 'players.id': userId },
  {
    $currentDate: { updatedAt: true },
    $set: { games },
  });
