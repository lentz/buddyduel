const request = require('request');
const BovadaParser = require('../services/BovadaParser');

const options = {
  url: 'https://sports.bovada.lv/football/nfl?json=true',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.96 Safari/537.36',
    Cookie: 'LANGUAGE=en; DEFLANG=en; W-CC=US; W_CUR=USD; COUNTRY=US; OQP=json=true',
  },
};

module.exports.getLines = () => new Promise((resolve, reject) => {
  request(options, (err, _res, body) => {
    if (err) reject(err);
    resolve(BovadaParser.call(body));
  });
});
