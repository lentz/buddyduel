import { Game } from './game';
import { Player } from '../duels/player';

export class DuelWeek {
  games = new Array<Game>();

  constructor(
    public _id: string,
    public duelId: string,
    public year: number,
    public description: string,
    public betAmount: number,
    public picker: Player,
    public players: Player[],
    public record: { wins: number; losses: number; pushes: number },
    public winnings: number,
    public sport: string,
    games: Game[],
  ) {}
}
