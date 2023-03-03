/* eslint no-console: 0 */
import { parentPort } from 'node:worker_threads';
import process from 'node:process';

import dotenv from 'dotenv';
import { addMinutes } from 'date-fns';
import sgMail from '@sendgrid/mail';

import '../lib/db.js';
import { default as DuelWeek, IDuelWeek } from '../models/DuelWeek.js';
import * as user from '../services/user.js';
import IGame from '../models/IGame.js';

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

function messageBody(duelWeek: IDuelWeek, games: IGame[]) {
  return `
    <p>You still need to make a pick for the following ${
      duelWeek.sport
    } games which are starting soon:</p>
    <p>
      ${games
        .map(
          (game) =>
            `${game.awayTeam} (${game.awaySpread}) @ ${game.homeTeam} (${game.homeSpread})`,
        )
        .join('<br />')}
    </p>
    <p>
      <a href="${process.env.BASE_URL}/duel-weeks/${duelWeek.id}">
        Make your picks now
      </a>
    </p>
    <p></p>
    <small>
      You can disable these emails on your <a href="${
        process.env.BASE_URL
      }/profile">BuddyDuel Profile</a>
    </small>
  `;
}

function opponentName(duelWeek: IDuelWeek) {
  const opponent = duelWeek.players.find(
    (player) => player.id !== duelWeek.picker.id,
  );
  return opponent ? opponent.name : 'Unknown';
}

async function sendAlert(duelWeek: IDuelWeek, games: IGame[]) {
  const userInfo = await user.getInfo(duelWeek.picker.id);
  const preferences = userInfo.user_metadata || {};
  if (preferences.reminderEmails === false) {
    return Promise.resolve();
  }
  console.log(
    'Sending pick alert to',
    userInfo.email,
    'for duel week',
    duelWeek.id,
  );
  return sgMail.send({
    to: userInfo.email,
    from: 'BuddyDuel <alerts@buddyduel.net>',
    subject:
      `${duelWeek.sport} games starting soon vs ${opponentName(duelWeek)}` +
      ' - get your picks in!',
    html: messageBody(duelWeek, games),
  });
}

function isApproachingUnpicked(game: IGame, startsWithinTime: Date) {
  return (
    !game.selectedTeam &&
    game.startTime > new Date() &&
    game.startTime < startsWithinTime
  );
}

async function run() {
  const beginTime = Date.now();
  try {
    const startsWithinTime = addMinutes(new Date(), 90);
    const query = {
      games: {
        $elemMatch: {
          selectedTeam: null,
          startTime: { $gt: Date.now(), $lt: startsWithinTime },
        },
      },
      skipped: false,
    };
    const duelWeeks = await DuelWeek.find(query).exec();

    /* eslint-disable-next-line no-restricted-syntax */
    for (const duelWeek of duelWeeks) {
      const unpickedGames = duelWeek.games.filter((game) => {
        return isApproachingUnpicked(game, startsWithinTime);
      });
      if (unpickedGames.length) {
        await sendAlert(duelWeek, unpickedGames);
      }
    }
  } catch (err) {
    console.error('Error sending pick alerts:', err);
    process.exit(1);
  }

  console.log('Send pick alerts completed in', Date.now() - beginTime, 'ms');

  if (parentPort) parentPort.postMessage('done');
  else process.exit(0);
}

run();
