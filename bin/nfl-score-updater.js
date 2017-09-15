/* eslint no-param-reassign: 0 */

require('dotenv').config();
const async = require('async');
const ObjectID = require('mongodb').ObjectID;
const request = require('request');

const betResult = require('../lib/betResult');
const db = require('../db');
const NFLWeek = require('../services/NFLWeek');
const NFLScoreParser = require('../lib/NFLScoreParser');

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
      db.get().collection('results').findOneAndReplace(
        { year: result.year, weekNum: result.weekNum },
        result,
        { upsert: true },
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
    (waterfall) => {
      db.get().collection('results').findOne(
        { year: NFLWeek.seasonYear, weekNum: NFLWeek.currentWeek() },
        waterfall
      );
    },
    (result, waterfall) => {
      db.get().collection('duelweeks').find({ weekNum: NFLWeek.currentWeek() })
        .toArray((err, duelWeeks) => {
          if (err) { return waterfall(err); }
          return waterfall(null, result, duelWeeks);
        });
    },
    (result, duelWeeks, waterfall) => {
      if (!result || result.scores.length < 1) { return cb(null, null); }
      return async.each(duelWeeks, (duelWeek, eachCb) => {
        db.get().collection('duelweeks').updateOne(
          { _id: new ObjectID(duelWeek._id) },
          { $set: { games: gamesWithResults(duelWeek.games, result.scores) } },
          eachCb
        );
      }, waterfall);
    },
  ], cb);
}

async.series([
  async.apply(db.connect, process.env.MONGODB_URI),
  async.apply(getScores),
  async.apply(updateDuelWeeks),
], (err) => {
  db.close(() => {});
  if (err) { console.error('Error updating NFL results:', err); } // eslint-disable-line no-console
});
