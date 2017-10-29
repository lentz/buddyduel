/* eslint no-console: 0 */

require('dotenv').config();
const async = require('async');
const DuelWeek = require('../models/DuelWeek');
const moment = require('moment');
const mongoose = require('mongoose');
const NFLWeek = require('../services/NFLWeek');
const sgMail = require('@sendgrid/mail');
const user = require('../services/user');

function messageBody(duelWeek, games) {
  return `
    <p>You still need to make a pick for the following games which are starting soon:</p>
    <p>
      ${games.map(game => `${game.awayTeam} (${game.awaySpread}) @ ${game.homeTeam} (${game.homeSpread})`).join('<br />')}
    </p>
    <p>
      <a href="http://www.buddyduel.net/duel-weeks/${duelWeek.id}">
        Make your picks now
      </a>
    </p>
    <p></p>
    <small>
      You can disable these emails on your <a href="http://www.buddyduel.net/profile">BuddyDuel Profile</a>
    </small>
  `;
}

function opponentName(duelWeek) {
  return duelWeek.players.find(player => player.id !== duelWeek.picker.id).name;
}

function sendAlert(duelWeek, games, cb) {
  user.getInfo(duelWeek.picker.id, (err, userInfo) => {
    if (err) { return cb(err); }
    const preferences = userInfo.user_metadata || {};
    if (preferences.reminderEmails === false) { return cb(); }
    console.log('Sending pick alert to', userInfo.email, 'for duel week', duelWeek.id);
    const msg = {
      to: userInfo.email,
      from: 'BuddyDuel <alerts@buddyduel.net>',
      subject: `Games starting soon vs ${opponentName(duelWeek)} - get your picks in!`,
      html: messageBody(duelWeek, games),
    };
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    return sgMail.send(msg, cb);
  });
}

function isApproachingUnpicked(game) {
  return !game.selectedTeam && game.startTime > +new Date() &&
         moment().isSameOrAfter(moment(game.startTime).subtract(1.5, 'hours'));
}

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });
mongoose.connection.on('error', (err) => {
  console.error(`Unable to connect to Mongo: ${err}`);
  process.exit(1);
});
DuelWeek.find({ weekNum: NFLWeek.currentWeek(), 'games.selectedTeam': null },
  { picker: 1, games: 1, players: 1 },
  null,
  (err, duelWeeks) => {
    if (err) {
      console.err('Error finding unpicked duel weeks', err);
      process.exit(1);
    }
    async.each(duelWeeks, (duelWeek, eachCb) => {
      const unpickedGames = duelWeek.games.filter(game => isApproachingUnpicked(game));
      if (unpickedGames.length < 1) { return eachCb(); }
      return sendAlert(duelWeek, unpickedGames, eachCb);
    }, (eachErr) => {
      if (eachErr) { console.error('Error sending alerts', err); }
      mongoose.connection.close();
    });
  });
