import * as moment from 'moment';
import IGame from './models/IGame';

export interface ISport {
  getWeekDescription: (game: IGame) => string;
  name: string;
  paths: string[];
  seasonYear: number;
}

export const sports: ISport[] = [
  {
    getWeekDescription: (game: IGame) => {
      const weekOne = new Date('2019-11-05T04:00:00Z');
      return `Week ${moment(game.startTime).diff(moment(weekOne), 'weeks') + 1}`;
    },
    name: 'NCAAB',
    paths: ['/basketball/college-basketball'],
    seasonYear: 2019,
  },
  {
    name: 'NFL',
    getWeekDescription: (game: IGame) => {
      const weekOne = new Date('2019-09-04T04:00:00Z');
      return `Week ${moment(game.startTime).diff(moment(weekOne), 'weeks') + 1}`;
    },
    paths: ['/football/nfl', '/football/nfl-playoffs', '/football/super-bowl'],
    seasonYear: 2019,
  },
  {
    name: 'XFL',
    getWeekDescription: (game: IGame) => {
      const weekOne = new Date('2020-02-04T04:00:00Z');
      return `Week ${moment(game.startTime).diff(moment(weekOne), 'weeks') + 1}`;
    },
    paths: ['/football/xfl'],
    seasonYear: 2020,
  },
];
