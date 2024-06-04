import sgMail from '@sendgrid/mail';

import IGame from '../models/IGame.js';
import betResult from '../lib/betResult.js';
import { ISport } from '../sports.js';

const BASE_URL = 'https://api.the-odds-api.com/v4/sports';

export async function updateScores(games: IGame[], sport: ISport) {
  type Event = {
    id: string;
    commence_time: string;
    completed: boolean;
    home_team: string;
    away_team: string;
    scores?: {
      name: string;
      score: number;
    }[];
  };

  const res = await fetch(
    `${BASE_URL}/${sport.key}/scores?apiKey=${process.env.ODDS_API_KEY}&daysFrom=1`,
  );

  if (!res.ok) {
    const errMessage = `Failed to update scores with status ${
      res.status
    }: ${await res.text()}`;

    throw new Error(errMessage);
  }

  const resBody: Event[] = await res.json();

  for (const game of games) {
    const currentEvent = resBody.find((event) => event.id === game.id);
    if (!currentEvent?.scores) continue;

    if (currentEvent.completed) {
      game.time = 'Final';
    } else if (new Date() > game.startTime) {
      game.time = 'Live';
    }

    currentEvent.scores.forEach((score) => {
      if (score.name === game.homeTeam) {
        game.homeScore = score.score;
      } else if (score.name === game.awayTeam) {
        game.awayScore = score.score;
      }
    });

    game.result = betResult(game);
  }
}

function unpickedAndNotBegun(game: IGame) {
  return !game.selectedTeam && game.startTime > new Date();
}

export async function updateOdds(existingGames: IGame[], sport: ISport) {
  type EventOdds = {
    away_team: string;
    bookmakers: {
      markets: {
        outcomes: {
          name: string;
          point: number;
        }[];
      }[];
    }[];
    commence_time: string;
    home_team: string;
    id: string;
  };

  const oddsRes = await fetch(
    `${BASE_URL}/${sport.key}/odds?apiKey=${process.env.ODDS_API_KEY}&bookmakers=pinnacle&markets=spreads`,
  );
  if (!oddsRes.ok) {
    const errMessage = `Failed to update odds with status ${
      oddsRes.status
    }: ${await oddsRes.text()}`;

    sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
    await sgMail.send({
      to: process.env.ADMIN_EMAIL,
      from: 'BuddyDuel <alerts@buddyduel.fly.dev>',
      subject: 'Failed to updated game odds',
      html: errMessage,
    });

    throw new Error(errMessage);
  }
  const oddsResBody: EventOdds[] = await oddsRes.json();

  for (const event of oddsResBody) {
    const existingGame = existingGames.find((game) => event.id === game.id);

    const homeOutcome = event.bookmakers[0]?.markets[0]?.outcomes.find(
      (outcome) => {
        return outcome.name === event.home_team;
      },
    );

    if (!homeOutcome) continue;

    if (existingGame) {
      existingGame.startTime = new Date(event.commence_time);
      if (unpickedAndNotBegun(existingGame)) {
        existingGame.homeSpread = homeOutcome.point;
        existingGame.awaySpread = homeOutcome.point * -1;
      }
    } else if (new Date(event.commence_time) < sport.currentWeek().weekEnd) {
      existingGames.push({
        awaySpread: homeOutcome.point * -1,
        awayTeam: event.away_team,
        homeSpread: homeOutcome.point,
        homeTeam: event.home_team,
        id: event.id,
        startTime: new Date(event.commence_time),
      });
    }
  }
}
