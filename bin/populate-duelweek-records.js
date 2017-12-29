/* eslint no-param-reassign: 0, no-console: 0 */

require('dotenv').config();
const mongoose = require('mongoose');

const DuelWeek = require('../models/DuelWeek');

mongoose.Promise = global.Promise;

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });

    const duelWeeks = await DuelWeek.find({}).exec();
    await Promise.all(duelWeeks.map(async (duelWeek) => {
      duelWeek.updateRecord();
      return duelWeek.save();
    }));
  } catch (err) {
    console.error('Error populating records:', err);
  } finally {
    mongoose.connection.close();
  }
}

run();
