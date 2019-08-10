const moment = require('moment');

const weekOne = 1567569600000; // Sep 4, 2019

module.exports.seasonYear = 2019;

module.exports.forGame = game => moment(game.startTime).diff(moment(weekOne), 'weeks') + 1;

module.exports.currentWeek = () => this.forGame(+new Date());
