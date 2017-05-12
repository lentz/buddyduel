const request = require('request');
const BovadaParser = require('../services/BovadaParser');

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.96 Safari/537.36';
const COOKIE = 'LANGUAGE=en; DEFLANG=en; W-CC=US; W_CUR=USD; COUNTRY=US; OQP=json=true';

module.exports.index = (req, res) => {
  const options = {
    url: 'https://sports.bovada.lv/football?json=true',
    headers: {
      'User-Agent': USER_AGENT,
      Cookie: COOKIE,
    },
  };

  request(options, (err, _res, body) => {
    if (err) res.status(500).send(err);
    try {
      res.json(BovadaParser.call(body));
    } catch (parseError) {
      res.status(500).send(parseError.message);
    }
  });
};
