/* eslint-disable no-console */

import db from '../lib/db';
import { default as Duel, IDuel } from '../models/Duel';
import * as DuelWeekUpdater from '../services/DuelWeekUpdater';

async function run() {
  const beginTime = Date.now();
  try {
    const duels = await Duel.find({ status: 'active' }).exec() as IDuel[];
    await DuelWeekUpdater.call(duels);
  } catch (err) {
    console.error('Error updating duel weeks:', err);
  } finally {
    db.close();
    console.log('Completed in', Date.now() - beginTime, 'ms');
    process.exit();
  }
}

run();
