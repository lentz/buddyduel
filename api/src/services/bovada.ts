import axios from 'axios';
import * as BovadaParser from '../services/BovadaParser';
import { ISport } from '../sports';
import IGame from '../models/IGame';

axios.defaults.baseURL = 'https://www.bovada.lv/services/sports/event/v2/events/A/description';
axios.defaults.headers.common['User-Agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.96 Safari/537.36';

async function getResponses(sport: ISport, params = {}) {
  const opts = {
    params: {
      lang: 'en',
      marketFilterId: 'def',
      ...params,
    },
  };

  return Promise.all(sport.paths.map(path => axios.get(path, opts)));
}

export async function getPreMatchLines(sport: ISport): Promise<IGame[]> {
  const matchLineResponses = await getResponses(sport, { preMatchOnly: true });

  return matchLineResponses.reduce((matchLines: any[], response: any) => matchLines.concat(
    BovadaParser.parseGames(response.data),
  ), []);
}

export interface ILiveScore {
  clock: {
    period: string;
    gameTime: string;
  };
  eventId: string;
  latestScore: {
    home: string;
    visitor: string;
  };
}

export async function getLiveScores(sport: ISport): Promise<ILiveScore[]> {
  const liveScoreResponses = await getResponses(sport, { liveOnly: true });

  const liveScoreIds: string[] = liveScoreResponses
    .filter((response: { data?: any }) => response.data && response.data.length)
    .reduce((scoreIds: string[], response: any) => scoreIds.concat(
      response.data[0].events.map((event: { id: string }) => event.id),
    ), []);

  if (!liveScoreIds.length) {
    return [];
  }

  const scoreRes = await axios.get(
    `https://services.bovada.lv/services/sports/results/api/v1/scores/${liveScoreIds.join('+')}`,
    { headers: { Accept: 'application/vnd.scoreboards.summary+json' } },
  );

  return scoreRes.data;
}
