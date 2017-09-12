require('dotenv').config();
const db = require('../db');
const request = require('request');
const xml2js = require('xml2js');
const crypto = require('crypto');
const async = require('async');

const teamMap = {
  ARI: 'Arizona Cardinals',
  ATL: 'Atlanta Falcons',
  BAL: 'Baltimore Ravens',
  BUF: 'Buffalo Bills',
  CAR: 'Carolina Panthers',
  CHI: 'Chicago Bears',
  CIN: 'Cincinnati Bengals',
  CLE: 'Cleveland Browns',
  DAL: 'Dallas Cowboys',
  DEN: 'Denver Broncos',
  DET: 'Detroit Lions',
  GB: 'Green Bay Packers',
  HOU: 'Houston Texans',
  IND: 'Indianapolis Colts',
  JAX: 'Jacksonville Jaguars',
  KC: 'Kansas City Chiefs',
  LA: 'Los Angeles Rams',
  LAC: 'Los Angeles Chargers',
  MIA: 'Miami Dolphins',
  MIN: 'Minnesota Vikings',
  NE: 'New England Patriots',
  NO: 'New Orleans Saints',
  NYG: 'New York Giants',
  NYJ: 'New York Jets',
  OAK: 'Oakland Raiders',
  PHI: 'Philadelphia Eagles',
  PIT: 'Pittsburgh Steelers',
  SEA: 'Seattle Seahawks',
  SF: 'San Francisco 49ers',
  TB: 'Tampa Bay Buccaneers',
  TEN: 'Tennessee Titans',
  WAS: 'Washington Redskins',
};

function updateScores(cb) {
  async.waterfall([
    (waterfall) => {
      request.get('http://www.nfl.com/liveupdate/scorestrip/ss.xml', (err, _res, body) => {
        if (err) { return waterfall(err); }
        return waterfall(null, body);
      });
    },
    (xml, waterfall) => xml2js.parseString(xml, waterfall),
  ],
  (err, scoresJSON) => {
    if (err) { return cb(err); }
    return async.each(scoresJSON.ss.gms, (nflWeek, eachWeekCb) => {
      const year = Number(nflWeek.$.y);
      const weekNum = Number(nflWeek.$.w);
      const scores = nflWeek.g
        .map(game => game.$)
        .filter(game => game.q !== 'P')
        .map(game => ({
          gameId: crypto.createHash('md5')
            .update(`${teamMap[game.h]}|${teamMap[game.v]}|${year}|${weekNum}`)
            .digest('hex'),
          homeScore: Number(game.hs),
          awayScore: Number(game.vs),
        }));
      db.get().collection('results').findOneAndReplace(
        { year, weekNum },
        { year, weekNum, scores },
        { upsert: true },
        eachWeekCb
      );
    }, cb);
  });
}

async.series([
  async.apply(db.connect, process.env.MONGODB_URI),
  async.apply(updateScores),
], (err) => {
  db.close(() => {});
  if (err) { console.error('Error updating NFL scores:', err); } // eslint-disable-line no-console
});
