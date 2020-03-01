/* eslint no-console: 0 */

require('dotenv').config();
const db = require('../lib/db');
const Duel = require('../models/Duel');
const DuelWeekUpdater = require('../services/DuelWeekUpdater');

async function run() {
  const startTime = new Date();
  try {
    const duels = await Duel.find({ status: 'active' }).exec();
    await DuelWeekUpdater.call(duels);
  } catch (err) {
    console.error('Error updating duel weeks:', err);
  } finally {
    db.close();
    console.log('Completed in', new Date() - startTime, 'ms');
    process.exit();
  }
}

run();
