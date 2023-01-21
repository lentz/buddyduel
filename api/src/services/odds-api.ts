import axios from 'axios';

import IGame from '../models/IGame';
import { ISport } from '../sports';

axios.defaults.baseURL = 'https://api.the-odds-api.com/v4/sports';

async function setScores(games: IGame[], sport: ISport) {
  const opts = {
    params: {
      apiKey: process.env.ODDS_API_KEY,
      daysFrom: 1,
      sport: sport.key,
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
    }

    currentEvent.scores.forEach((score) => {
      if (score.name === game.homeTeam) {
        game.homeScore = score.score;
      } else if (score.name === game.awayTeam) {
        game.awayScore = score.score;
      }
    });
  }

  return games;
}

export async function getGames(sport: ISport): Promise<IGame[]> {
  const games: IGame[] = [];

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
    const homeOutcome = event.bookmakers[0].markets[0].outcomes.find(
      (outcome: any) => {
        return outcome.name === event.home_team;
      },
    );

    if (!homeOutcome) continue;

    games.push({
      awaySpread: homeOutcome.point * -1,
      awayTeam: event.away_team,
      homeSpread: homeOutcome.point,
      homeTeam: event.home_team,
      id: event.id,
      startTime: new Date(event.commence_time),
    });
  }

  const gamesHaveStarted = games.some((game) => new Date() > game.startTime);
  if (gamesHaveStarted) {
    await setScores(games, sport);
  }

  return games;
}
