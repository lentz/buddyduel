import { Player } from './player';

export class Duel {
  constructor(
    public _id: string,
    public status: string,
    public players: Player[], ) {

  }
}
