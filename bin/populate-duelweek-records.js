/* eslint no-param-reassign: 0, no-console: 0 */

require('dotenv').config();
const async = require('async');
const mongoose = require('mongoose');

const DuelWeek = require('../models/DuelWeek');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });
mongoose.connection.on('error', (err) => {
  console.error(`Unable to connect to Mongo: ${err}`);
  process.exit(1);
});

DuelWeek.find({}, (findErr, duelWeeks) => {
  async.each(duelWeeks, (duelWeek, eachCb) => {
    duelWeek.updateRecord();
    duelWeek.save(eachCb);
  }, (err) => {
    mongoose.connection.close();
    if (err) { console.error('Error populating records:', err); }
  });
});
