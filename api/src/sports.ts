import * as moment from 'moment';

export interface ISport {
  competitionId: string;
  currentWeek: () => string;
  editionId: string;
  module: string;
  name: string;
  seasonYear: number;
  sportId: string;
}

export const sports: ISport[] = [
  {
    currentWeek: () => {
      const now = new Date();
      if (now < new Date('2020-03-19')) {
        const weekOne = new Date('2019-11-05');
        return `Week ${moment(now).diff(moment(weekOne), 'weeks') + 1}`;
      } else if (now < new Date('2020-03-21')) {
        return 'Round 1';
      } else if (now < new Date('2020-03-26')) {
        return 'Round 2';
      } else if (now < new Date('2020-03-28')) {
        return 'Sweet 16';
      } else if (now < new Date('2020-04-04')) {
        return 'Elite 8';
      } else if (now < new Date('2020-04-06')) {
        return 'Final Four';
      } else if (now < new Date('2020-04-07')) {
        return 'Championship';
      } else {
        return 'TBD';
      }
    },
    competitionId: '/sport/basketball/league:7',
    editionId: '/sport/basketball/season:664634', // Unique to season year
    name: 'NCAAB',
    module: 'basketball',
    seasonYear: 2020,
    sportId: '/sport/basketball',
  },
  {
    competitionId: '/sport/football/league:1',
    currentWeek: () => {
      const weekOne = new Date('2020-09-09T04:00:00Z');
      return `Week ${moment().diff(moment(weekOne), 'weeks') + 1}`;
    },
    editionId: '/sport/football/season:236', // Unique to season year
    name: 'NFL',
    module: 'americanfootball',
    seasonYear: 2020,
    sportId: '/sport/football',
  },
];
