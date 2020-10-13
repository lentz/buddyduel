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
      if (game.startTime < new Date('2020-03-19')) {
        const weekOne = new Date('2019-11-05');
        return `Week ${
          moment(game.startTime).diff(moment(weekOne), 'weeks') + 1
        }`;
      } else if (game.startTime < new Date('2020-03-21')) {
        return 'Round 1';
      } else if (game.startTime < new Date('2020-03-26')) {
        return 'Round 2';
      } else if (game.startTime < new Date('2020-03-28')) {
        return 'Sweet 16';
      } else if (game.startTime < new Date('2020-04-04')) {
        return 'Elite 8';
      } else if (game.startTime < new Date('2020-04-06')) {
        return 'Final Four';
      } else if (game.startTime < new Date('2020-04-07')) {
        return 'Championship';
      } else {
        return 'TDB';
      }
    },
    name: 'NCAAB',
    paths: ['/basketball/college-basketball'],
    seasonYear: 2019,
  },
  {
    name: 'NFL',
    getWeekDescription: (game: IGame) => {
      const weekOne = new Date('2020-09-09T04:00:00Z');
      return `Week ${
        moment(game.startTime).diff(moment(weekOne), 'weeks') + 1
      }`;
    },
    paths: ['/football/nfl', '/football/nfl-playoffs', '/football/super-bowl'],
    seasonYear: 2020,
  },
];
