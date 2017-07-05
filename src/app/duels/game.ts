export class Game {
  constructor(
    public id: string,
    public updated: boolean,
    public homeTeam: string,
    public homeSpread: number,
    public awayTeam: string,
    public awaySpread: number,
    public startTime: number,
    public selectedTeam: string, ) {

  }
}
