/* eslint-disable no-console */
import { parentPort } from 'node:worker_threads';
import process from 'node:process';

import '../lib/db';
import { default as Duel } from '../models/Duel';
import * as DuelWeekUpdater from '../services/DuelWeekUpdater';

async function run() {
  const beginTime = Date.now();
  try {
    const duels = await Duel.find({ status: 'active' }).exec();
    await DuelWeekUpdater.call(duels);
  } catch (err) {
    console.error('Error updating duel weeks:', err);
    process.exit(1);
  }

  console.log('Update duel weeks completed in', Date.now() - beginTime, 'ms');

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
}

run();
