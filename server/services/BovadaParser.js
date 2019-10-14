const jp = require('jsonpath');
const util = require('util');
const createGameId = require('../lib/createGameId');
const NFLWeek = require('./NFLWeek');

const teamRegex = /^[\w\s\d]+$/;

function parseGame(game) {
  let pointSpread;
  try {
    [pointSpread] = jp.query(
      game,
      '$..markets[?(@.description=="Point Spread" && @.status=="O")]',
    );
    if (!pointSpread) { return null; }
    const home = pointSpread.outcomes.find(team => team.type === 'H');
    const away = pointSpread.outcomes.find(team => team.type === 'A');
    if (!home.description.match(teamRegex) || !away.description.match(teamRegex)) {
      return null;
    }
    return {
      id: createGameId(
        home.description.trim(),
        away.description.trim(),
        NFLWeek.seasonYear,
        NFLWeek.forGame(game),
      ),
      homeTeam: home.description.trim(),
      homeSpread: Number(home.price.handicap),
      awayTeam: away.description.trim(),
      awaySpread: Number(away.price.handicap),
      startTime: game.startTime,
    };
  } catch (err) {
    console.warn(`Error parsing Bovada game: ${err}\nPointSpread JSON: ${util.inspect(pointSpread)}`); // eslint-disable-line no-console
    return null;
  }
}

module.exports.call = json => jp
  .query(json, '$..events[*]')
  .map(parseGame)
  .filter(game => game);
