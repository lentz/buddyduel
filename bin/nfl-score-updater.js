/* eslint no-param-reassign: 0, no-console: 0 */

require('dotenv').config();
const mongoose = require('mongoose');
const requestPromise = require('request-promise-native');

const betResult = require('../lib/betResult');
const DuelWeek = require('../models/DuelWeek');
const NFLWeek = require('../services/NFLWeek');
const NFLScoreParser = require('../lib/NFLScoreParser');
const Result = require('../models/Result');

mongoose.Promise = global.Promise;

async function getScores() {
  const scoresXML = await requestPromise.get('http://www.nfl.com/liveupdate/scorestrip/ss.xml');
  const scoresJSON = await NFLScoreParser.parseXML(scoresXML);
  Result.findOneAndUpdate(
    { year: scoresJSON.year, weekNum: scoresJSON.weekNum },
    scoresJSON,
    { upsert: true, setDefaultsOnInsert: true, runValidators: true },
  ).exec();
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

async function updateDuelWeeks() {
  const result = await Result.findOne(
    { year: NFLWeek.seasonYear, weekNum: NFLWeek.currentWeek() }
  ).exec();
  if (!result || result.scores.length < 1) { return Promise.resolve(); }
  const duelWeeks = await DuelWeek.find({ weekNum: result.weekNum }).exec();
  return Promise.all(duelWeeks.map(async (duelWeek) => {
    duelWeek.games = gamesWithResults(duelWeek.games, result.scores);
    duelWeek.updateRecord();
    return duelWeek.save();
  }));
}

async function run() {
  const startTime = new Date();
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });

    await getScores();
    await updateDuelWeeks();
  } catch (err) {
    console.error('Error updating NFL scores:', err);
  } finally {
    mongoose.connection.close();
    console.log('Completed in', new Date() - startTime, 'ms');
  }
}

run();
