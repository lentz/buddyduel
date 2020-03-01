const axios = require('axios');
const BovadaParser = require('../services/BovadaParser');

axios.defaults.baseURL = 'https://www.bovada.lv/services/sports/event/v2/events/A/description';
axios.defaults.headers.common['User-Agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.96 Safari/537.36';

async function getResponses(sport, params = {}) {
  const opts = {
    params: {
      lang: 'en',
      marketFilterId: 'def',
      ...params,
    },
  };

  return Promise.all(sport.paths.map(path => axios.get(path, opts)));
}

module.exports.getPreMatchLines = async (sportName) => {
  const matchLineResponses = await getResponses(sportName, { preMatchOnly: true });

  return matchLineResponses.reduce((matchLines, response) => matchLines.concat(
    BovadaParser.parseGames(response.data),
  ), []);
};

module.exports.getLiveScores = async (sport) => {
  const liveScoreResponses = await getResponses(sport, { liveOnly: true });

  const liveScoreIds = liveScoreResponses
    .filter(response => response.data && response.data.length)
    .reduce((scoreIds, response) => scoreIds.concat(
      response.data[0].events.map(event => event.id),
    ), []);

  if (!liveScoreIds.length) {
    return [];
  }

  const scoreRes = await axios.get(
    `https://services.bovada.lv/services/sports/results/api/v1/scores/${liveScoreIds.join('+')}`,
    { headers: { Accept: 'application/vnd.scoreboards.summary+json' } },
  );

  return scoreRes.data;
};
