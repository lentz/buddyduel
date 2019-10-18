/* eslint no-console: 0 */

require('dotenv').config();
const moment = require('moment');
const sgMail = require('@sendgrid/mail');
const db = require('../lib/db');
const NFLWeek = require('../services/NFLWeek');
const DuelWeek = require('../models/DuelWeek');
const user = require('../services/user');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function messageBody(duelWeek, games) {
  return `
    <p>You still need to make a pick for the following games which are starting soon:</p>
    <p>
      ${games.map(game => `${game.awayTeam} (${game.awaySpread}) @ ${game.homeTeam} (${game.homeSpread})`).join('<br />')}
    </p>
    <p>
      <a href="${process.env.BASE_URL}/duel-weeks/${duelWeek.id}">
        Make your picks now
      </a>
    </p>
    <p></p>
    <small>
      You can disable these emails on your <a href="${process.env.BASE_URL}/profile">BuddyDuel Profile</a>
    </small>
  `;
}

function opponentName(duelWeek) {
  return duelWeek.players.find(player => player.id !== duelWeek.picker.id).name;
}

async function sendAlert(duelWeek, games) {
  const userInfo = await user.getInfo(duelWeek.picker.id);
  const preferences = userInfo.user_metadata || {};
  if (preferences.reminderEmails === false) { return Promise.resolve(); }
  console.log('Sending pick alert to', userInfo.email, 'for duel week', duelWeek.id);
  const msg = {
    to: userInfo.email,
    from: 'BuddyDuel <alerts@buddyduel.net>',
    subject: `Games starting soon vs ${opponentName(duelWeek)} - get your picks in!`,
    html: messageBody(duelWeek, games),
  };
  return sgMail.send(msg);
}

function isApproachingUnpicked(game) {
  return !game.selectedTeam && game.startTime > +new Date()
    && moment().isSameOrAfter(moment(game.startTime).subtract(1.5, 'hours'));
}

async function run() {
  const startTime = new Date();
  try {
    const duelWeeks = await DuelWeek.find(
      { weekNum: NFLWeek.currentWeek(), 'games.selectedTeam': null },
      { picker: 1, games: 1, players: 1 },
      null
    ).exec();
    await Promise.all(duelWeeks.map(async (duelWeek) => {
      const unpickedGames = duelWeek.games.filter(game => isApproachingUnpicked(game));
      if (unpickedGames.length < 1) { return Promise.resolve(); }
      return sendAlert(duelWeek, unpickedGames);
    }));
  } catch (err) {
    console.error('Error sending pick alerts:', err);
  } finally {
    db.close();
    console.log('Completed in', new Date() - startTime, 'ms');
    process.exit();
  }
}

run();
