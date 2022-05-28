import { differenceInWeeks } from 'date-fns';

export interface ISport {
  competitionId: string;
  currentWeek: () => string | null;
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
        return `Week ${differenceInWeeks(weekOne, now) + 1}`;
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
      const weekOne = new Date('2021-09-08T04:00:00Z');
      const weekNum = differenceInWeeks(weekOne, new Date()) + 1;
      if (weekNum < 19) {
        return `Week ${weekNum}`;
      } else if (weekNum === 19) {
        return 'Wildcard';
      } else if (weekNum === 20) {
        return 'Divisional Playoffs';
      } else if (weekNum === 21) {
        return 'Conference Championships';
      } else if (weekNum === 22 || weekNum === 23) {
        return 'Super Bowl';
      } else {
        return null;
      }
    },
    editionId: '/sport/football/season:240', // Unique to season year
    name: 'NFL',
    module: 'americanfootball',
    seasonYear: 2021,
    sportId: '/sport/football',
  },
];
