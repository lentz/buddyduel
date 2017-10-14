/* eslint no-console: 0 */

require('dotenv').config();
const async = require('async');
const mongoose = require('mongoose');

const Duel = require('../models/Duel');
const DuelWeekUpdater = require('../services/DuelWeekUpdater');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });
mongoose.connection.on('error', (err) => {
  console.error(`Unable to connect to Mongo: ${err}`);
  process.exit(1);
});
async.waterfall([
  waterfall => Duel.find({ status: 'active' }, waterfall),
  (duels, waterfall) => DuelWeekUpdater.call(duels, waterfall),
],
(err) => {
  if (err) { console.error('Error updating duel weeks:', err); }
  mongoose.connection.close();
});
