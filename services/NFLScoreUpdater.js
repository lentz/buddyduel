/* eslint no-param-reassign: 0, no-console: 0 */

const axios = require('axios');
const crypto = require('crypto');
const EventEmitter = require('events');

const betResult = require('../lib/betResult');
const DuelWeek = require('../models/DuelWeek');
const NFLWeek = require('../services/NFLWeek');
const NFLScoreParser = require('../lib/NFLScoreParser');
const Result = require('../models/Result');

const REG_SEASON_URL = 'http://www.nfl.com/liveupdate/scorestrip/ss.xml';
const POST_SEASON_URL = 'http://www.nfl.com/liveupdate/scorestrip/postseason/ss.xml';

class NFLScoreUpdater extends EventEmitter {
  static async getScores() {
    const scoresURL = NFLWeek.currentWeek() > 17 ? POST_SEASON_URL : REG_SEASON_URL;
    return (await axios.get(scoresURL)).data;
  }

  static gamesWithResults(games, scores) {
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

  static async updateDuelWeeks() {
    const result = await Result.findOne({
      year: NFLWeek.seasonYear,
      weekNum: NFLWeek.currentWeek(),
    }).exec();
    if (!result || result.scores.length < 1) { return Promise.resolve(); }
    const duelWeeks = await DuelWeek.find({ weekNum: result.weekNum }).exec();
    return Promise.all(duelWeeks.map(async (duelWeek) => {
      duelWeek.games = NFLScoreUpdater.gamesWithResults(duelWeek.games, result.scores);
      duelWeek.updateRecord();
      return duelWeek.save();
    }));
  }

  async run() {
    try {
      const scoresXML = await NFLScoreUpdater.getScores();
      const scoresHash = crypto.createHash('md5').update(scoresXML).digest('hex');
      if (this.lastScoreHash === scoresHash) {
        return;
      }

      this.lastScoreHash = scoresHash;
      const scoresJSON = NFLScoreParser.parseXML(scoresXML);
      this.emit('update');
      await Result.findOneAndUpdate(
        { year: scoresJSON.year, weekNum: scoresJSON.weekNum },
        scoresJSON,
        { upsert: true, setDefaultsOnInsert: true, runValidators: true },
      ).exec();

      await NFLScoreUpdater.updateDuelWeeks();
    } catch (err) {
      this.emit('error', err);
    }
  }
}

module.exports = new NFLScoreUpdater();
