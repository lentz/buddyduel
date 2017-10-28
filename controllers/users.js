/* eslint no-param-reassign: 0 */

const async = require('async');
const DuelWeek = require('../models/DuelWeek');
const error = require('../lib/error');
const user = require('../services/user');

function getPerformance(userId, cb) {
  DuelWeek.find({ 'picker.id': userId }, { record: 1, winnings: 1 },
    (err, duelWeeks) => {
      if (err) { return cb(err); }
      return cb(null, duelWeeks.reduce((performance, duelWeek) => {
        performance.winnings += duelWeek.winnings;
        performance.record.wins += duelWeek.record.wins;
        performance.record.losses += duelWeek.record.losses;
        performance.record.pushes += duelWeek.record.pushes;
        return performance;
      }, { winnings: 0, record: { wins: 0, losses: 0, pushes: 0 } }));
    });
}

function getPreferences(userId, cb) {
  const defaults = {
    reminderEmails: true,
  };
  user.getInfo(userId, (err, userInfo) => {
    if (err) { return cb(err); }
    return cb(null, {
      preferences: Object.assign(defaults, userInfo.user_metadata || {}),
    });
  });
}

module.exports.show = (req, res) => {
  async.parallel({
    performance: async.apply(getPerformance, req.user.sub),
    preferences: async.apply(getPreferences, req.user.sub),
  }, (err, results) => {
    if (err) { return error.send(res, err, 'Failed to get user profile'); }
    return res.json(Object.assign(results.performance, results.preferences));
  });
};

module.exports.update = (req, res) => {
  user.updateMetadata(req.user.sub, req.body, (err, body) => {
    if (err || body.error) {
      return error.send(res, err || body, 'Failed to update preferences');
    }
    return res.status(204).send();
  });
};
