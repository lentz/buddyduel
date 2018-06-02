const moment = require('moment');

const weekOne = 1536044400000; // Sep 4, 2018

module.exports.seasonYear = 2018;

module.exports.forGame =
  game => moment(game.startTime).diff(moment(weekOne), 'weeks') + 1;

module.exports.currentWeek = () => this.forGame(+new Date());
