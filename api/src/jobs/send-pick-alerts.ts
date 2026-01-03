import sgMail from '@sendgrid/mail';
import { addMinutes } from 'date-fns';

import config from '../config.ts';
import { default as DuelWeek, type IDuelWeek } from '../models/DuelWeek.ts';
import type IGame from '../models/IGame.ts';
import * as user from '../services/user.ts';

sgMail.setApiKey(config.SENDGRID_API_KEY);

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
      <a href="${config.BUDDYDUEL_URL}/duel-weeks/${duelWeek._id}">
        Make your picks now
      </a>
    </p>
    <p></p>
    <small>
      You can disable these emails on your <a href="${
        config.BUDDYDUEL_URL
      }/profile">BuddyDuel Profile</a>
    </small>
  `;
}

function opponentName(duelWeek: IDuelWeek) {
  const opponent = duelWeek.players.find(
    (player) => player.id !== duelWeek.picker?.id,
  );
  return opponent ? opponent.name : 'Unknown';
}

async function sendAlert(duelWeek: IDuelWeek, games: IGame[]) {
  const userInfo = await user.getInfo(duelWeek.picker?.id);
  const preferences = userInfo.user_metadata || {};
  if (preferences.reminderEmails === false) {
    return Promise.resolve();
  }
  console.log(
    'Sending pick alert to',
    userInfo.email,
    'for duel week',
    duelWeek._id,
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

export default async function () {
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
  }

  console.log('Send pick alerts completed in', Date.now() - beginTime, 'ms');
}
