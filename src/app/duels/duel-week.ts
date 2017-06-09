import { Game } from './game';

export class DuelWeek {
  games = new Array<Game>();

  constructor(
    public _id: string,
    public duelId: number,
    games: Game[], ) {

  }
}
