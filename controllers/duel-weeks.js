/* eslint no-param-reassign: "off" */

const DuelWeek = require('../models/DuelWeek');
const error = require('../lib/error');
const NFLWeek = require('../services/NFLWeek');

module.exports.index = (req, res) => {
  const filter = { 'players.id': req.user.sub };
  if (req.query.duelId) {
    filter.duelId = req.query.duelId;
  } else if (req.query.current) {
    filter.weekNum = { $in: [NFLWeek.currentWeek(), NFLWeek.currentWeek() - 1] };
  }
  DuelWeek
    .find(filter)
    .sort({ year: -1, weekNum: -1 })
    .exec((err, duelWeeks) => {
      if (err) { return error.send(res, err, 'Unable to list duel weeks'); }
      return res.json(duelWeeks);
    });
};

module.exports.show = (req, res) => DuelWeek
  .findOne({ _id: req.params.id, 'players.id': req.user.sub }, (err, duelWeek) => {
    if (err) {
      return error.send(res, err, 'Failed to display duel week');
    } else if (!duelWeek) {
      return res.status(404).json({ message: 'Duel week not found' });
    }
    return res.json(duelWeek.toJSON({ virtuals: true }));
  });

function setSelections(duelWeek, pickedGames) {
  return duelWeek.games.map((game) => {
    const currentGame = pickedGames.find(pickedGame => pickedGame.id === game.id);
    if (currentGame) { game.selectedTeam = currentGame.selectedTeam; }
    return game;
  });
}

module.exports.update = (req, res) => DuelWeek
  .findOne({ _id: req.body._id, 'players.id': req.user.sub }, (err, duelWeek) => {
    if (err) { return error.send(res, err, 'Failed to update week picks'); }
    duelWeek.games = setSelections(duelWeek, req.body.games);
    return duelWeek.save((saveErr) => {
      if (saveErr) { return error.send(res, saveErr, 'Failed to update week picks'); }
      return res.json({ message: 'Picks successfully locked in' });
    });
  });
