import * as moment from 'moment';
import IGame from './models/IGame';

export interface ISport {
  name: string;
  paths: string[];
  seasonYear: number;
  weekOne: Date;
}

export const sports: ISport[] = [
  {
    name: 'NCAAB',
    paths: ['/basketball/college-basketball'],
    seasonYear: 2019,
    weekOne: new Date('2019-11-05T04:00:00Z'),
  },
  {
    name: 'NFL',
    paths: ['/football/nfl', '/football/nfl-playoffs', '/football/super-bowl'],
    seasonYear: 2019,
    weekOne: new Date('2019-09-04T04:00:00Z'),
  },
  {
    name: 'XFL',
    paths: ['/football/xfl'],
    seasonYear: 2020,
    weekOne: new Date('2020-02-04T04:00:00Z'),
  },
];

export function getGameWeek(game: IGame, sport: ISport) {
  return moment(game.startTime).diff(moment(sport.weekOne), 'weeks') + 1;
}
