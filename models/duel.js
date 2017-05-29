const ObjectID = require('mongodb').ObjectID;
const User = require('./user');
const db = require('../db');

const colName = 'duels';

module.exports.find = id => db.get().collection(colName)
  .findOne({ _id: new ObjectID(id), 'players.id': User.current().id });

module.exports.activeForUser = userId => db.get().collection(colName)
  .find({ 'players.id': userId, status: 'active' }).toArray();

module.exports.create = players => db.get().collection(colName).insertOne({
  players,
  status: 'pending',
});
