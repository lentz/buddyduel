require('dotenv').config();
const async = require('async');
const db = require('../db');
const DuelWeekUpdater = require('../services/DuelWeekUpdater');

async.waterfall([
  async.apply(db.connect, process.env.MONGODB_URI),
  waterfall => db.get().collection('duels').find({ status: 'active' }).toArray(waterfall),
  (duels, waterfall) => DuelWeekUpdater.call(duels, waterfall),
],
(err) => {
  if (err) { console.error('Error updating duel weeks:', err); } // eslint-disable-line no-console
  db.close(() => {});
});
