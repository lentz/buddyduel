import axios from 'axios';

import IGame from '../models/IGame.js';
import betResult from '../lib/betResult.js';
import { ISport } from '../sports.js';

axios.defaults.baseURL = 'https://api.the-odds-api.com/v4/sports';

export async function updateScores(games: IGame[], sport: ISport) {
  const opts = {
    params: {
      apiKey: process.env.ODDS_API_KEY,
      daysFrom: 1,
    },
  };

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
  const res = await axios.get<Event[]>(`${sport.key}/scores`, opts);

  for (const game of games) {
    const currentEvent = res.data.find((event) => event.id === game.id);
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

  const oddsRes = await axios.get<EventOdds[]>(`${sport.key}/odds`, {
    params: {
      apiKey: process.env.ODDS_API_KEY,
      bookmakers: 'pinnacle',
      markets: 'spreads',
    },
  });

  for (const event of oddsRes.data) {
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
