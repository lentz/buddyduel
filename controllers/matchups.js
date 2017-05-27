const ObjectID = require('mongodb').ObjectID;
const db = require('../db');
const bovada = require('../lib/bovada');
const user = require('../lib/user');

module.exports.index = (req, res) => {
  const collection = db.get().collection('picks');
  // Create first matchup if none found
  collection
    .find({ userId: user.current().id }, { _id: true })
    .toArray((err, results) => {
      if (err) res.status(500).send(err);
      res.json(results.map(result => result._id));
    });
};

module.exports.show = (req, res) => {
  const collection = db.get().collection('picks');
  bovada.getLines().then(lines => new Promise((resolve, reject) => {
    collection.findOne({
      _id: new ObjectID(req.params.id),
      userId: user.current().id,
    }, (err, result) => {
      if (err) reject(err);
      res.send(mergeMatchups(result, lines));
    });
  })).catch((err) => {
    res.status(500).send(err);
  });
};

module.exports.update = (req, res) => {
  const collection = db.get().collection('picks');
  collection.insertOne(req.body, (err, result) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send(result);
  });
};

function mergeMatchups(userPicks, _latestLines) {
  // TODO: Implement
  return userPicks;
}
