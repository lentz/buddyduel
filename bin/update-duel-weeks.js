require('dotenv').config();
const async = require('async');
const mongoose = require('mongoose');

const Duel = require('../models/Duel');
const DuelWeekUpdater = require('../services/DuelWeekUpdater');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });
mongoose.connection.on('error', (err) => {
  console.error(`Unable to connect to Mongo: ${err}`); // eslint-disable-line no-console
  process.exit(1);
});
async.waterfall([
  waterfall => Duel.find({ status: 'active' }, waterfall),
  (duels, waterfall) => DuelWeekUpdater.call(duels, waterfall),
],
(err) => {
  if (err) { console.error('Error updating duel weeks:', err); } // eslint-disable-line no-console
  mongoose.connection.close();
});
