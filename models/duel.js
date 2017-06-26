const ObjectID = require('mongodb').ObjectID;
const db = require('../db');

const colName = 'duels';

module.exports.find = (id, userId) => db.get().collection(colName)
  .findOne({ _id: new ObjectID(id), 'players.id': userId });

module.exports.forUser = (userId, status, cb) => {
  const query = { 'players.id': userId };
  if (status) query.status = status;
  db.get().collection(colName).find(query).toArray(cb);
};

module.exports.create = players => db.get().collection(colName).insertOne({
  players,
  status: 'pending',
  updatedAt: new Date(),
});

module.exports.accept = (id, player) => db.get().collection(colName).updateOne(
  { _id: new ObjectID(id), status: 'pending' },
  {
    $currentDate: { updatedAt: true },
    $set: { status: 'active' },
    $push: { players: player },
  });
