const crypto = require('crypto');
const jp = require('jsonpath');
const NFLWeek = require('./NFLWeek');
const util = require('util');

const teamRegex = /^[\w\s\d]+$/;

function parseGame(game) {
  let pointSpread;
  try {
    pointSpread = jp.query(game, '$..itemList[?(@.description=="Point Spread")]')[0];
    if (!pointSpread) { return null; }
    const home = pointSpread.outcomes.find(team => team.type === 'H');
    const away = pointSpread.outcomes.find(team => team.type === 'A');
    if (!home.description.match(teamRegex) || !away.description.match(teamRegex)) {
      return null;
    }
    return {
      id: crypto.createHash('md5')
        .update(`${home.description}|${away.description}|${NFLWeek.seasonYear}|${NFLWeek.forGame(game)}`)
        .digest('hex'),
      homeTeam: home.description,
      homeSpread: Number(home.price.handicap),
      awayTeam: away.description,
      awaySpread: Number(away.price.handicap),
      startTime: game.startTime,
    };
  } catch (err) {
    console.warn(`Error parsing Bovada game: ${err}\nPointSpread JSON: ${util.inspect(pointSpread)}`); // eslint-disable-line no-console
    return null;
  }
}

module.exports.call = json => jp
  .query(json, '$..items[?(@.type=="NFL" || @.type=="NFL, Playoffs")]')
  .map(parseGame)
  .filter(game => game);
