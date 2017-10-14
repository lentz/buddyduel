/* eslint no-param-reassign: 0, no-console: 0 */

require('dotenv').config();
const async = require('async');
const mongoose = require('mongoose');
const request = require('request');

const betResult = require('../lib/betResult');
const DuelWeek = require('../models/DuelWeek');
const NFLWeek = require('../services/NFLWeek');
const NFLScoreParser = require('../lib/NFLScoreParser');
const Result = require('../models/Result');

function getScores(cb) {
  async.waterfall([
    (waterfall) => {
      request.get('http://www.nfl.com/liveupdate/scorestrip/ss.xml', (err, _res, body) => {
        if (err) { return waterfall(err); }
        return waterfall(null, body);
      });
    },
    (scoresXML, waterfall) => NFLScoreParser.parseXML(scoresXML, waterfall),
    (result, waterfall) => {
      Result.findOneAndUpdate(
        { year: result.year, weekNum: result.weekNum },
        result,
        { upsert: true, setDefaultsOnInsert: true, runValidators: true },
        waterfall
      );
    }], cb);
}

function gamesWithResults(games, scores) {
  return games.map((game) => {
    const gameResult = scores.find(score => score.gameId === game.id);
    if (gameResult) {
      game.awayScore = gameResult.awayScore;
      game.homeScore = gameResult.homeScore;
      game.time = gameResult.time;
      game.result = betResult(game);
    }
    return game;
  });
}

function updateDuelWeeks(cb) {
  async.waterfall([
    waterfall => Result.findOne(
      { year: NFLWeek.seasonYear, weekNum: NFLWeek.currentWeek() },
      waterfall
    ),
    (result, waterfall) => DuelWeek.find(
      { weekNum: NFLWeek.currentWeek() },
      (err, duelWeeks) => {
        if (err) { return waterfall(err); }
        return waterfall(null, result, duelWeeks);
      }
    ),
    (result, duelWeeks, waterfall) => {
      if (!result || result.scores.length < 1) { return cb(null, null); }
      return async.each(duelWeeks, (duelWeek, eachCb) => {
        duelWeek.games = gamesWithResults(duelWeek.games, result.scores);
        duelWeek.save(eachCb);
      }, waterfall);
    },
  ], cb);
}

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });
mongoose.connection.on('error', (err) => {
  console.error(`Unable to connect to Mongo: ${err}`);
  process.exit(1);
});
async.series([
  async.apply(getScores),
  async.apply(updateDuelWeeks),
], (err) => {
  mongoose.connection.close();
  if (err) { console.error('Error updating NFL results:', err); }
});
