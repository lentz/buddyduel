/* eslint no-param-reassign: 0 */

const DuelWeek = require('../models/DuelWeek');
const error = require('../lib/error');

module.exports.show = (req, res) => {
  const profile = { record: { wins: 0, losses: 0, pushes: 0 }, winnings: 0 };
  DuelWeek.find({ 'picker.id': req.user.sub }, { record: 1, winnings: 1 },
    (err, duelWeeks) => {
      if (err) { return error.send(res, err, 'Failed to get user record'); }
      duelWeeks.reduce((currentProfile, duelWeek) => {
        currentProfile.winnings += duelWeek.winnings;
        currentProfile.record.wins += duelWeek.record.wins;
        currentProfile.record.losses += duelWeek.record.losses;
        currentProfile.record.pushes += duelWeek.record.pushes;
        return currentProfile;
      }, profile);
      return res.json(profile);
    });
};
