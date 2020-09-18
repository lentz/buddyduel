import * as jp from 'jsonpath';
import { inspect } from 'util';
import IGame from '../models/IGame';

const teamRegex = /^[\w\s\d()#&.]+$/;

function parseGame(game: IGame): IGame | null {
  let pointSpread;
  try {
    [pointSpread] = jp.query(
      game,
      '$..markets[?(@.description=="Point Spread" && @.status=="O")]',
    );
    if (!pointSpread) {
      return null;
    }
    const home = pointSpread.outcomes.find(
      (team: { type: string }) => team.type === 'H',
    );
    const away = pointSpread.outcomes.find(
      (team: { type: string }) => team.type === 'A',
    );
    if (
      !home?.description?.match(teamRegex) ||
      !away?.description?.match(teamRegex)
    ) {
      return null;
    }
    return {
      id: game.id,
      homeTeam: home.description.trim(),
      homeSpread: Number(home.price.handicap),
      awayTeam: away.description.trim(),
      awaySpread: Number(away.price.handicap),
      startTime: game.startTime,
    };
  } catch (err) {
    console.warn(
      `Error parsing Bovada game: ${err}\nPointSpread JSON: ${inspect(
        pointSpread,
      )}`,
    ); // eslint-disable-line no-console
    return null;
  }
}

export function parseGames(json: any) {
  return jp
    .query(json, '$..events[*]')
    .map(parseGame)
    .filter((game) => game) as IGame[];
}
