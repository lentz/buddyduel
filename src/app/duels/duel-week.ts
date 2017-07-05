import { Game } from './game';
import { Player } from './player';

export class DuelWeek {
  games = new Array<Game>();

  constructor(
    public _id: string,
    public duelId: string,
    public weekNum: number,
    public picker: Player,
    games: Game[], ) {

  }
}
