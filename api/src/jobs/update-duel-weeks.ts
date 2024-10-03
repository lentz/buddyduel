import Duel from '../models/Duel.js';
import * as DuelWeekUpdater from '../services/DuelWeekUpdater.js';

export default async function () {
  const beginTime = Date.now();

  try {
    const duels = await Duel.find({ status: 'active' }).exec();
    await DuelWeekUpdater.call(duels);
  } catch (err) {
    console.error('Error updating duel weeks:', err);
  }

  console.log('Update duel weeks completed in', Date.now() - beginTime, 'ms');
}
