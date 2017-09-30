import { Game } from './game';
import { Player } from './player';

export class DuelWeek {
  games = new Array<Game>();

  constructor(
    public _id: string,
    public duelId: string,
    public weekNum: number,
    public betAmount: number,
    public picker: Player,
    public players: Player[],
    public record: { wins: number, losses: number, pushes: number },
    games: Game[], ) {

  }
}
