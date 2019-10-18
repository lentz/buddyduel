/* eslint no-param-reassign: 0, no-console: 0 */

const axios = require('axios');
const EventEmitter = require('events');

const betResult = require('../lib/betResult');
const DuelWeek = require('../models/DuelWeek');
const logger = require('../lib/logger');
const md5 = require('../lib/md5');
const NFLWeek = require('../services/NFLWeek');
const parseNFLScores = require('../lib/parseNFLScores');
const Result = require('../models/Result');

const SCORES_URL = 'https://feeds.nfl.com/feeds-rs/scores.json';

class NFLScoreUpdater extends EventEmitter {
  static async getScores() {
    return (await axios.get(SCORES_URL)).data;
  }

  static gamesWithResults(games, scores, opts = { setBetResult: true }) {
    return games.map((game) => {
      const gameResult = scores.find(score => score.gameId === game.id);
      if (gameResult) {
        game.awayScore = gameResult.awayScore;
        game.homeScore = gameResult.homeScore;
        game.time = gameResult.time;
        if (opts.setBetResult) { game.result = betResult(game); }
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
      duelWeek.games = NFLScoreUpdater.gamesWithResults(
        duelWeek.games,
        result.scores,
        { setBetResult: !duelWeek.skipped },
      );
      duelWeek.updateRecord();
      return duelWeek.save();
    }));
  }

  async run() {
    try {
      const scoresJSON = await NFLScoreUpdater.getScores();

      const scoresHash = md5(JSON.stringify(scoresJSON));
      if (this.lastScoreHash === scoresHash) {
        return;
      }
      this.lastScoreHash = scoresHash;

      logger.info(
        `Updating result for ${scoresJSON.season} week ${scoresJSON.week} with ${scoresHash}`,
      );
      this.emit('update');
      await Result.findOneAndUpdate(
        { year: scoresJSON.season, weekNum: scoresJSON.week },
        parseNFLScores(scoresJSON),
        { upsert: true, setDefaultsOnInsert: true, runValidators: true },
      ).exec();

      await NFLScoreUpdater.updateDuelWeeks();
    } catch (err) {
      this.emit('error', err);
    }
  }
}

module.exports = new NFLScoreUpdater();
