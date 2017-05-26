import { Matchup } from './matchup';

export class MatchupWeek {
  constructor(
    public _id: string,
    public duelId: number,
    public picks: Matchup[], ) {

  }
}
