import IGame from '../models/IGame';

export default function(game: IGame) {
  if (game.homeScore === undefined || game.awayScore === undefined) { return ''; }

  const homeResult = game.homeScore + game.homeSpread;
  const awayResult = game.awayScore + game.awaySpread;

  if (!game.selectedTeam) { return 'Loss'; }
  if (homeResult === game.awayScore) { return 'Push'; }
  if ((game.selectedTeam === game.awayTeam && awayResult > game.homeScore)
     || (game.selectedTeam === game.homeTeam && homeResult > game.awayScore)) {
    return 'Win';
  }
  return 'Loss';
}
