const request = require('request');
const ObjectID = require('mongodb').ObjectID;
const db = require('../db');
const BovadaParser = require('../services/BovadaParser');

const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.96 Safari/537.36';
const cookie = 'LANGUAGE=en; DEFLANG=en; W-CC=US; W_CUR=USD; COUNTRY=US; OQP=json=true';
const collectionName = 'picks';

module.exports.show = (req, res) => {
  getLatestLines().then((lines) => {
    return new Promise((resolve, reject) => {
      const collection = db.get().collection(collectionName);
      console.log(req.params);
      collection.findOne({ _id: new ObjectID(req.params.id) }, (err, result) => {
        if (err) reject(err);
        res.send(mergeMatchups(result, lines));
      });
    });
  }).catch((err) => {
    res.status(500).send(err);
  });
};

module.exports.update = (req, res) => {
  const collection = db.get().collection(collectionName);

  collection.insertOne(picks, (err, result) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(result);
  });
};

// TODO: Create new action

function getLatestLines() {
  const options = {
    url: 'https://sports.bovada.lv/football/nfl?json=true',
    headers: {
      'User-Agent': userAgent,
      Cookie: cookie,
    },
  };

  return new Promise((resolve, reject) => {
    request(options, (err, _res, body) => {
      if (err) reject(err);
      resolve(BovadaParser.call(body));
    });
  });
}

function mergeMatchups(userPicks, latestLines) {
  // TODO: Implement
  return userPicks;
}
