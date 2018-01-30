/* eslint no-param-reassign: 0 */

const DuelWeek = require('../models/DuelWeek');
const user = require('../services/user');

async function getPerformance(userId) {
  const duelWeeks = await DuelWeek.find({ 'picker.id': userId }, { record: 1, winnings: 1 }).exec();
  return duelWeeks.reduce((performance, duelWeek) => {
    performance.winnings += duelWeek.winnings;
    performance.record.wins += duelWeek.record.wins;
    performance.record.losses += duelWeek.record.losses;
    performance.record.pushes += duelWeek.record.pushes;
    return performance;
  }, { winnings: 0, record: { wins: 0, losses: 0, pushes: 0 } });
}

async function getPreferences(userId) {
  return {
    preferences: Object.assign(
      { reminderEmails: true },
      (await user.getInfo(userId)).user_metadata || {}
    ),
  };
}

module.exports.show = async (req, res) => res.json(Object.assign(
  await getPerformance(req.user.sub),
  await getPreferences(req.user.sub)
));

module.exports.update = async (req, res) => {
  await user.updateMetadata(req.user.sub, req.body);
  return res.status(204).send();
};
