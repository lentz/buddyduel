const moment = require('moment');

const weekOne = 1504742400000; // Sep 7, 2017

module.exports.seasonYear = 2017;

module.exports.forGame =
  game => moment(game.startTime).diff(moment(weekOne), 'weeks') + 1;
