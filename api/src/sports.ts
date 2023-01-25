import { add, differenceInWeeks } from 'date-fns';

export interface ISport {
  key: string;
  currentWeek: () => { description?: string; weekEnd: Date };
  name: string;
  seasonYear: number;
}

export const sports: ISport[] = [
  {
    currentWeek: () => {
      const weekOne = new Date('2019-11-05');
      const now = new Date();
      const weekNum = differenceInWeeks(now, weekOne) + 1;
      let description;

      if (now < new Date('2020-03-19')) {
        description = `Week ${weekNum}`;
      } else if (now < new Date('2020-03-21')) {
        description = 'Round 1';
      } else if (now < new Date('2020-03-26')) {
        description = 'Round 2';
      } else if (now < new Date('2020-03-28')) {
        description = 'Sweet 16';
      } else if (now < new Date('2020-04-04')) {
        description = 'Elite 8';
      } else if (now < new Date('2020-04-06')) {
        description = 'Final Four';
      } else if (now < new Date('2020-04-07')) {
        description = 'Championship';
      }

      return { description, weekEnd: add(weekOne, { weeks: weekNum }) };
    },
    key: 'basketball_ncaab',
    name: 'NCAAB',
    seasonYear: 2020,
  },
  {
    currentWeek: () => {
      const weekOne = new Date('2022-09-07T04:00:00Z');
      const weekNum = differenceInWeeks(new Date(), weekOne) + 1;

      let description;

      if (weekNum < 19) {
        description = `Week ${weekNum}`;
      } else if (weekNum === 19) {
        description = 'Wildcard';
      } else if (weekNum === 20) {
        description = 'Divisional Playoffs';
      } else if (weekNum === 21) {
        description = 'Conference Championships';
      } else if (weekNum === 22 || weekNum === 23) {
        description = 'Super Bowl';
      }

      return { description, weekEnd: add(weekOne, { weeks: weekNum }) };
    },
    key: 'americanfootball_nfl',
    name: 'NFL',
    seasonYear: 2022,
  },
];
