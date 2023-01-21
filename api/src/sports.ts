import { differenceInWeeks } from 'date-fns';

export interface ISport {
  key: string;
  currentWeek: () => string | null;
  name: string;
  seasonYear: number;
}

export const sports: ISport[] = [
  {
    currentWeek: () => {
      const now = new Date();
      if (now < new Date('2020-03-19')) {
        const weekOne = new Date('2019-11-05');
        return `Week ${differenceInWeeks(now, weekOne) + 1}`;
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
    key: 'basketball_ncaab',
    name: 'NCAAB',
    seasonYear: 2020,
  },
  {
    currentWeek: () => {
      const weekOne = new Date('2022-09-07T04:00:00Z');
      const weekNum = differenceInWeeks(new Date(), weekOne) + 1;
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
    key: 'americanfootball_nfl',
    name: 'NFL',
    seasonYear: 2022,
  },
];
