const moment = require('moment');

const weekOne = 1504594800000; // Sep 5, 2017

module.exports.seasonYear = 2017;

module.exports.forGame =
  game => moment(game.startTime).diff(moment(weekOne), 'weeks') + 1;

module.exports.currentWeek = () => this.forGame(+new Date());
