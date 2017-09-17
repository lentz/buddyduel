/* eslint no-param-reassign: "off" */

const async = require('async');
const error = require('../lib/error');
const Duel = require('../models/duel');
const DuelWeek = require('../models/duelweek');

module.exports.index = (req, res) => {
  async.waterfall([
    waterfall => Duel.forUser(req.user.sub, 'active', waterfall),
    (duels, waterfall) =>
      DuelWeek.forDuelIds(duels.map(duel => duel._id.toString()), waterfall),
  ], (err, duelWeeks) => {
    if (err) { return error.send(res, err, 'Unable to list duel weeks'); }
    return res.json(duelWeeks);
  });
};

module.exports.show = (req, res) => {
  async.parallel([
    parallel => DuelWeek.find(req.params.id, parallel),
    parallel => Duel.forUser(req.user.sub, 'active', parallel),
  ], (err, results) => {
    if (err) { return error.send(res, err, 'Failed to display duel week'); }
    const duelWeek = results[0];
    const duels = results[1];
    if (!duels.map(duel => duel._id.toString()).includes(duelWeek.duelId)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    let wins = 0;
    let losses = 0;
    let pushes = 0;
    duelWeek.games.forEach((game) => {
      switch (game.result) {
        case 'Win': wins += 1; break;
        case 'Loss': losses += 1; break;
        case 'Push': pushes += 1; break;
        default:
      }
    });
    duelWeek.record = `${wins}-${losses}-${pushes}`;
    duelWeek.winnings = (wins * duelWeek.betAmount) - (losses * duelWeek.betAmount);
    return res.json(duelWeek);
  });
};

function setSelections(duelWeek, pickedGames) {
  return duelWeek.games.map((game) => {
    const currentGame = pickedGames.find(pickedGame => pickedGame.id === game.id);
    if (currentGame) { game.selectedTeam = currentGame.selectedTeam; }
    return game;
  });
}

module.exports.update = (req, res) => {
  async.parallel([
    parallel => DuelWeek.find(req.body._id, parallel),
    parallel => Duel.forUser(req.user.sub, 'active', parallel),
  ], (err, results) => {
    if (err) { return error.send(res, err, 'Failed to authorize update'); }
    const duelWeek = results[0];
    const duels = results[1];
    if (!duels.map(duel => duel._id.toString()).includes(duelWeek.duelId)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const updatedGames = setSelections(duelWeek, req.body.games);
    return DuelWeek.updatePicks(req.body._id, updatedGames, (updateErr) => {
      if (updateErr) { return error.send(res, updateErr, 'Failed to update duel week'); }
      return res.json({ message: 'Picks successfully locked in' });
    });
  });
};
