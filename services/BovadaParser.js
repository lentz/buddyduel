const jp = require('jsonpath');

module.exports.call = json => jp
  .query(JSON.parse(json), '$..items[?(@.type=="NFL")]')
  .map((game) => {
    const pointSpread = jp.query(game, '$..itemList[?(@.description=="Point Spread")]')[0];
    const home = pointSpread.outcomes.find(team => team.type === 'H');
    const away = pointSpread.outcomes.find(team => team.type === 'A');
    return {
      id: game.id,
      homeTeam: home.description,
      homeSpread: Number(home.price.handicap),
      awayTeam: away.description,
      awaySpread: Number(away.price.handicap),
      startTime: game.startTime,
    };
  });
