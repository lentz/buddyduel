const md5 = require('./md5');

module.exports = (homeTeam, awayTeam, year, week) => {
  if (!homeTeam || !awayTeam || !year || !week) {
    throw new TypeError('Missing argument!');
  }
  return md5(`${homeTeam}|${awayTeam}|${year}|${week}`);
};
