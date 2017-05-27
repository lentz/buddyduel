const ObjectID = require('mongodb').ObjectID;
const db = require('../db');
const bovada = require('../lib/bovada');
const user = require('../lib/user');

const colName = 'duelweeks';

function mergeMatchups(userPicks, latestLines) {
  // TODO: Implement
  console.log(latestLines);
  return userPicks;
}

module.exports.index = (req, res) => {
  const col = db.get().collection(colName);
  // Create first duel week if none found
  col.find({ userId: user.current().id }, { _id: true })
     .toArray((err, results) => {
       if (err) res.status(500).send(err);
       res.json(results.map(result => result._id));
     });
};

module.exports.show = (req, res) => {
  const col = db.get().collection(colName);
  bovada.getLines().then(lines => new Promise((resolve, reject) => {
    col.findOne({
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
  const col = db.get().collection(colName);
  col.updateOne(
    { _id: new ObjectID(req.body._id), userId: user.current().id },
    { $set: { games: req.body.games } },
    (err, result) => {
      if (err) return res.status(500).send(err);
      return res.send(result);
    });
};
