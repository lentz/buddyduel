/* eslint no-param-reassign: "off" */

const ObjectID = require('mongodb').ObjectID;
const db = require('../db');

const colName = 'duelweeks';

module.exports.find = (id, cb) => db.get().collection(colName).findOne({
  _id: new ObjectID(id),
}, cb);

module.exports.forDuel = (duelId, userId) => db.get().collection(colName)
  .find({ duelId, 'players.id': userId }).toArray();

module.exports.create = duelWeek => db.get().collection(colName).insertOne(duelWeek);

module.exports.findOrNew = (year, weekNum, duelId, cb) => {
  db.get().collection(colName).findOne(
    { year, weekNum: Number(weekNum), duelId },
    (err, result) => {
      if (result !== null) {
        return cb(null, result);
      }
      return cb(null, {
        year, weekNum: Number(weekNum), duelId, games: [], picker: null,
      });
    });
};

module.exports.save = (duelWeek, cb) => {
  delete duelWeek.updatedAt;
  db.get().collection(colName).findOneAndUpdate(
    { year: duelWeek.year, weekNum: duelWeek.weekNum, duelId: duelWeek.duelId },
    {
      $currentDate: { updatedAt: true },
      $set: duelWeek,
    },
    { upsert: true },
    cb,
  );
};

module.exports.updatePicks = (id, games, cb) => {
  db.get().collection(colName).updateOne(
    { _id: new ObjectID(id) },
    {
      $currentDate: { updatedAt: true },
      $set: { games },
    },
    cb,
  );
};
