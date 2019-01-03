const axios = require('axios');
const BovadaParser = require('../services/BovadaParser');

axios.defaults.baseURL = 'https://www.bovada.lv/services/sports/event/v2/events/A/description/football';
axios.defaults.headers.common['User-Agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.96 Safari/537.36';

module.exports.getLines = async () => {
  const [regSeasonResp, playoffResp] = await Promise.all([
    axios.get('/nfl?marketFilterId=def&preMatchOnly=true&lang=en'),
    axios.get('/nfl-playoffs?marketFilterId=def&preMatchOnly=true&lang=en'),
  ]);

  return BovadaParser.call(regSeasonResp.data)
    .concat(BovadaParser.call(playoffResp.data));
};
