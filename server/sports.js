const moment = require('moment');

const sports = [
  {
    name: 'NCAAB',
    paths: ['/basketball/college-basketball'],
    seasonYear: 2019,
    weekOne: Date.parse('2019-11-05T04:00:00Z'),
  },
  {
    name: 'NFL',
    paths: ['/football/nfl', '/football/nfl-playoffs', '/football/super-bowl'],
    seasonYear: 2019,
    weekOne: Date.parse('2019-09-04T04:00:00Z'),
  },
  {
    name: 'XFL',
    paths: ['/football/xfl'],
    seasonYear: 2020,
    weekOne: Date.parse('2020-02-08T04:00:00Z'),
  },
];

function getGameWeek(game, sport) {
  return moment(game.startTime).diff(moment(sport.weekOne), 'weeks') + 1;
}

function getCurrentWeek(sport) {
  return getGameWeek({ startTime: Date.now() }, sport);
}

module.exports = {
  getCurrentWeek,
  getGameWeek,
  sports,
};
