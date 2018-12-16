/* eslint no-param-reassign: 0 */
const jwtDecode = require('jwt-decode');
const axios = require('axios');

const DuelWeek = require('../models/DuelWeek');
const user = require('../services/user');

const COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 365; // 1 year
const COOKIE_SECURE = process.env.BASE_URL.startsWith('https');

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

module.exports.authenticate = async (req, res, next) => {
  const response = await axios.post(
    `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
    {
      grant_type: 'authorization_code',
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      code: req.query.code,
      redirect_uri: `${process.env.BASE_URL}/auth/callback`,
    },
    {
      headers: { 'content-type': 'application/json' },
    }
  );
  const jwt = jwtDecode(response.data.id_token);
  req.session.userId = jwt.sub;
  req.session.userName = jwt.name;
  res.cookie('userId', jwt.sub, { maxAge: COOKIE_MAX_AGE, secure: COOKIE_SECURE });
  res.cookie('userName', jwt.name, { maxAge: COOKIE_MAX_AGE, secure: COOKIE_SECURE });
  next();
};

module.exports.logout = (req, res, next) => {
  req.session.destroy();
  res.clearCookie('connect.sid', { secure: COOKIE_SECURE });
  res.clearCookie('userId', { secure: COOKIE_SECURE });
  res.clearCookie('userName', { secure: COOKIE_SECURE });
  next();
};

module.exports.show = async (req, res) => res.json(Object.assign(
  await getPerformance(req.session.userId),
  await getPreferences(req.session.userId)
));

module.exports.update = async (req, res) => {
  await user.updateMetadata(req.session.userId, req.body);
  return res.status(204).send();
};
