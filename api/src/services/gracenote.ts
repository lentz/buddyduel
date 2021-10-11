import axios from 'axios';

import IGame from '../models/IGame';
import { ISport } from '../sports';

axios.defaults.baseURL =
  'https://sports-prd-ghosts-api-widgets.sports.gracenote.com';
axios.defaults.headers.common['User-Agent'] =
  'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.75 Safari/537.36';
axios.defaults.headers.common['Referer'] =
  'https://widgets.sports.gracenote.com/';

interface IMatch {
  awayName: string;
  awayNickname: string;
  awayResult: number;
  dateStart: string;
  homeName: string;
  homeNickname: string;
  homeResult: number;
  state: {
    clock?: string;
    status: string;
    overtime?: string;
    period?: string;
  };
}

function matchStarted(match: IMatch) {
  return ['delay-rain', 'in-progress', 'complete'].includes(match.state.status);
}

function createTimeString(match: IMatch) {
  if (!matchStarted(match)) {
    return undefined;
  }

  if (match.state.status === 'complete') {
    return match.state?.overtime ? 'Final/OT' : 'Final';
  } else if (/delay/i.test(match.state?.status)) {
    return `Delayed ${match.state?.period}Q`;
  }

  const clock = match.state?.clock
    ? match.state.clock.replace(/^00:0?/, '')
    : '0:00';

  if (match.state?.period === '2' && clock === '0:00') {
    return 'Halftime';
  }

  return match.state.overtime
    ? `OT ${clock}`
    : `${match.state?.period}Q ${clock}`;
}

async function getMatchIdsForWeek(sport: ISport, week: string) {
  const opts = {
    params: {
      competitionId: sport.competitionId,
      customerId: 0,
      editionId: sport.editionId,
      filter: { include: ['matchType'] },
      languageCode: 2,
      module: sport.module,
      page: 1,
      sportId: sport.sportId,
      timeZone: 'America/New_York',
      type: 'scoreboard',
    },
  };

  const res = await axios.get('/api/DatePickers/all', opts);

  const matches = res?.data?.datepicker?.matchSortByWeek?.[week];

  if (!matches) {
    return [];
  }

  return matches.map((match: { matchId: string }) => match.matchId);
}

function getHomeSpreadForMatch(matchId: string, oddsRes: any) {
  const match = oddsRes.data.oddsSportsBooks.matches.find(
    (m: { matchId: string }) => {
      return m.matchId === matchId;
    },
  );

  const matchOdds = match?.odds.find((bookOdds: any) => {
    return bookOdds.book === 'pinnacle';
  });

  return matchOdds?.activePointSpread.find((spread: any) => {
    return !spread.scope;
  }).homeHandicap;
}

export async function getGames(
  sport: ISport,
  weekDescription: string,
): Promise<IGame[]> {
  const matchIds = await getMatchIdsForWeek(sport, weekDescription);
  const games: IGame[] = [];

  const oddsRes = await axios.get('api/OddsSportsBooks/Competition', {
    params: {
      competitionId: sport.competitionId,
      customerId: 1379,
      languageCode: 2,
      module: 'na_teamsports',
      sportId: sport.sportId,
      type: 'oddssportsbooks',
    },
  });

  for (const matchId of matchIds) {
    const opts = {
      params: {
        competitionId: sport.competitionId,
        customerId: 0,
        languageCode: 2,
        matchId: matchId,
        module: sport.module,
        sportId: sport.sportId,
        timeZone: 'America/New_York',
        type: 'scoreboard',
      },
    };

    const res = await axios.get('/api/Scores/match', opts);
    const match: IMatch = res.data.scores;
    const homeSpread = getHomeSpreadForMatch(matchId, oddsRes);

    games.push({
      awaySpread: homeSpread ? homeSpread * -1 : undefined,
      awayScore: matchStarted(match) ? match.awayResult : undefined,
      awayTeam: `${match.awayName} ${match.awayNickname}`,
      homeSpread,
      homeScore: matchStarted(match) ? match.homeResult : undefined,
      homeTeam: `${match.homeName} ${match.homeNickname}`,
      id: matchId,
      startTime: new Date(match.dateStart),
      time: createTimeString(match),
    });
  }

  return games;
}
