import mongoose from '../lib/db.ts';
import Duel from '../models/Duel.ts';
import DuelWeekUpdater from '../services/DuelWeekUpdater.ts';

try {
  const beginTime = Date.now();

  const duels = await Duel.find({ status: 'active' }).exec();
  await DuelWeekUpdater(duels);

  console.log('Update duel weeks completed in', Date.now() - beginTime, 'ms');
} finally {
  await mongoose.disconnect();
}
