const crypto = require('crypto');
const jp = require('jsonpath');
const NFLWeek = require('./NFLWeek');

module.exports.call = json => jp
  .query(JSON.parse(json), '$..items[?(@.type=="NFL")]')
  .map((game) => {
    const pointSpread = jp.query(game, '$..itemList[?(@.description=="Point Spread")]')[0];
    const home = pointSpread.outcomes.find(team => team.type === 'H');
    const away = pointSpread.outcomes.find(team => team.type === 'A');
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
  });
