import { Player } from './player';

export class Duel {
  constructor(
    public _id: string,
    public code: string,
    public status: string,
    public betAmount: number,
    public players: Player[],
    public sport: string,
  ) {}
}
