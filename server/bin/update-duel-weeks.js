/* eslint no-console: 0 */

require('dotenv').config();
const mongoose = require('mongoose');

const Duel = require('../models/Duel');
const DuelWeekUpdater = require('../services/DuelWeekUpdater');

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);

async function run() {
  const startTime = new Date();
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
    const duels = await Duel.find({ status: 'active' }).exec();
    await DuelWeekUpdater.call(duels);
  } catch (err) {
    console.error('Error updating duel weeks:', err);
  } finally {
    mongoose.connection.close();
    console.log('Completed in', new Date() - startTime, 'ms');
    process.exit();
  }
}

run();
