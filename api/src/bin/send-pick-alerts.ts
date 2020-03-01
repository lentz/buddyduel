/* eslint no-console: 0 */

import * as dotenv from 'dotenv';
import * as moment from 'moment';
import * as sgMail from '@sendgrid/mail';
import db from '../lib/db';
import { getCurrentWeek, sports } from '../sports';
import { default as DuelWeek, IDuelWeek } from '../models/DuelWeek';
import * as user from '../services/user';
import IGame from '../models/IGame';

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

function messageBody(duelWeek: IDuelWeek, games: IGame[]) {
  return `
    <p>You still need to make a pick for the following ${duelWeek.sport} games which are starting soon:</p>
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

function opponentName(duelWeek: IDuelWeek) {
  const opponent = duelWeek.players.find(player => player.id !== duelWeek.picker.id);
  return opponent ? opponent.name : 'Unknown';
}

async function sendAlert(duelWeek: IDuelWeek, games: IGame[]) {
  const userInfo = await user.getInfo(duelWeek.picker.id);
  const preferences = userInfo.user_metadata || {};
  if (preferences.reminderEmails === false) { return Promise.resolve(); }
  console.log('Sending pick alert to', userInfo.email, 'for duel week', duelWeek.id);
  return sgMail.send({
    to: userInfo.email,
    from: 'BuddyDuel <alerts@buddyduel.net>',
    subject: `${duelWeek.sport} games starting soon vs ${opponentName(duelWeek)}`
     + ' - get your picks in!',
    html: messageBody(duelWeek, games),
  });
}

function isApproachingUnpicked(game: IGame) {
  return !game.selectedTeam && game.startTime > +new Date()
    && moment().isSameOrAfter(moment(game.startTime).subtract(1.5, 'hours'));
}

async function run() {
  const startTime = Date.now();
  try {
    const query: any = { 'games.selectedTeam': null };
    query.$or = sports.map(sport => ({
      sport: sport.name,
      weekNum: getCurrentWeek(sport),
    }));
    const duelWeeks = await DuelWeek.find(query).exec() as IDuelWeek[];

    /* eslint-disable-next-line no-restricted-syntax */
    for (const duelWeek of duelWeeks) {
      const unpickedGames = duelWeek.games.filter(isApproachingUnpicked);
      if (unpickedGames.length) {
        await sendAlert(duelWeek, unpickedGames);
      }
    }
  } catch (err) {
    console.error('Error sending pick alerts:', err);
  } finally {
    db.close();
    console.log('Completed in', Date.now() - startTime, 'ms');
    process.exit();
  }
}

run();
