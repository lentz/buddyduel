export default interface IGame {
  awayScore?: number;
  awaySpread: number;
  awayTeam: string;
  homeScore?: number;
  homeSpread: number;
  homeTeam: string;
  id: string;
  result?: string;
  selectedTeam?: string;
  startTime: Date;
  time?: string;
}
