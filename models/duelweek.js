/* eslint no-param-reassign: "off" */

const ObjectID = require('mongodb').ObjectID;
const db = require('../db');

const colName = 'duelweeks';

module.exports.find = (id, cb) => db.get().collection(colName).findOne({
  _id: new ObjectID(id),
}, cb);

module.exports.forDuelIds = (duelIds, cb) => db.get().collection(colName)
  .find({ duelId: { $in: duelIds } })
  .sort({ weekNum: -1 })
  .toArray(cb);

module.exports.create = duelWeek => db.get().collection(colName).insertOne(duelWeek);

module.exports.findOrNew = (year, weekNum, duel, cb) => {
  db.get().collection(colName).findOne(
    { year, weekNum: Number(weekNum), duelId: duel._id.toString() },
    (err, result) => {
      if (result !== null) {
        return cb(null, result);
      }
      return cb(null, {
        year,
        weekNum: Number(weekNum),
        duelId: duel._id.toString(),
        betAmount: duel.betAmount,
        games: [],
        picker: duel.players[weekNum % 2],
      });
    });
};

module.exports.save = (duelWeek, cb) => {
  delete duelWeek.updatedAt;
  db.get().collection(colName).findOneAndUpdate(
    { year: duelWeek.year, weekNum: duelWeek.weekNum, duelId: duelWeek.duelId },
    { $currentDate: { updatedAt: true }, $set: duelWeek },
    { upsert: true, returnOriginal: false },
    (err, result) => {
      if (err) { return cb(err); }
      return cb(null, result.value);
    });
};

module.exports.updatePicks = (id, games, cb) => {
  db.get().collection(colName).updateOne(
    { _id: new ObjectID(id) },
    {
      $currentDate: { updatedAt: true },
      $set: { games },
    },
    cb);
};
