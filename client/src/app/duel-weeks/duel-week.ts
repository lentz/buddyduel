import { Game } from './game';
import { Player } from '../duels/player';

export class DuelWeek {
  _id: string;
  duelId: string;
  games: Game[];
  year: number;
  description: string;
  betAmount: number;
  picker: Player;
  players: Player[];
  record: { wins: number; losses: number; pushes: number };
  winnings: number;
  sport: string;

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  constructor(duelWeek: any) {
    this._id = duelWeek._id;
    this.duelId = duelWeek.duelId;
    this.games = duelWeek.games ?? [];
    this.year = duelWeek.year;
    this.description = duelWeek.description;
    this.betAmount = duelWeek.betAmount;
    this.picker = duelWeek.picker ?? new Player();
    this.players = duelWeek.players ?? [];
    this.record = duelWeek.record ?? {};
    this.winnings = duelWeek.winnings;
    this.sport = duelWeek.sport;
  }
}
