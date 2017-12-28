/* eslint no-param-reassign: "off" */

const DuelWeek = require('../models/DuelWeek');
const NFLWeek = require('../services/NFLWeek');

module.exports.index = async (req, res) => {
  const filter = { 'players.id': req.user.sub };
  if (req.query.duelId) {
    filter.duelId = req.query.duelId;
  } else if (req.query.current) {
    filter.weekNum = { $in: [NFLWeek.currentWeek(), NFLWeek.currentWeek() - 1] };
  }
  res.json(await DuelWeek.find(filter).sort({ year: -1, weekNum: -1 }).exec());
};

module.exports.show = async (req, res) => {
  const duelWeek = await DuelWeek.findOne(
    { _id: req.params.id, 'players.id': req.user.sub }
  ).exec();
  if (!duelWeek) {
    return res.status(404).json({ message: 'Duel week not found' });
  }
  return res.json(duelWeek);
};

function setSelections(duelWeek, pickedGames) {
  return duelWeek.games.map((game) => {
    const currentGame = pickedGames.find(pickedGame => pickedGame.id === game.id);
    if (currentGame) { game.selectedTeam = currentGame.selectedTeam; }
    return game;
  });
}

module.exports.update = async (req, res) => {
  const duelWeek = await DuelWeek.findOne(
    { _id: req.body._id, 'players.id': req.user.sub }
  ).exec();
  duelWeek.games = setSelections(duelWeek, req.body.games);
  await duelWeek.save();
  return res.json({ message: 'Picks successfully locked in' });
};
