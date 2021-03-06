export class Game {
  static hasStarted(game: Game) {
    return Date.parse(game.startTime) < Date.now();
  }

  constructor(
    public id: string,
    public updated: boolean,
    public homeTeam: string,
    public homeSpread: number,
    public homeScore: number,
    public awayTeam: string,
    public awaySpread: number,
    public awayScore: number,
    public startTime: string,
    public selectedTeam: string | undefined,
    public time: string,
    public result: string,
  ) {}
}
