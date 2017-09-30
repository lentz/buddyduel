/* eslint no-param-reassign: "off" */

const error = require('../lib/error');
const DuelWeek = require('../models/DuelWeek');

module.exports.index = (req, res) => DuelWeek
  .find({ 'players.id': req.user.sub })
  .sort({ weekNum: -1 })
  .exec((err, duelWeeks) => {
    if (err) { return error.send(res, err, 'Unable to list duel weeks'); }
    return res.json(duelWeeks);
  });

module.exports.show = (req, res) => DuelWeek
  .findOne({ _id: req.params.id, 'players.id': req.user.sub }, (err, duelWeek) => {
    if (err) { return error.send(res, err, 'Failed to display duel week'); }
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
