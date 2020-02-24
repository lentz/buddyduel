/* eslint no-param-reassign: "off" */

const DuelWeek = require('../models/DuelWeek');
const { getCurrentWeek, sports } = require('../sports');

module.exports.index = async (req, res) => {
  const filter = { 'players.id': req.session.userId };
  if (req.query.duelId) {
    filter.duelId = req.query.duelId;
  } else if (req.query.current) {
    filter.$or = sports.map(sport => ({
      sport: sport.name,
      weekNum: { $in: [getCurrentWeek(sport), getCurrentWeek(sport) - 1] },
      year: sport.seasonYear,
    }));
  }
  res.json(await DuelWeek.find(filter).sort({ year: -1, weekNum: -1 }).exec());
};

function sortGames(duelWeek) {
  duelWeek.games.sort((a, b) => {
    if (a.startTime !== b.startTime) { return a.startTime - b.startTime; }
    if (a.awayTeam < b.awayTeam) {
      return -1;
    }
    if (a.awayTeam > b.awayTeam) {
      return 1;
    }
    return 0;
  });
  return duelWeek;
}

module.exports.show = async (req, res) => {
  const duelWeek = await DuelWeek.findOne({ _id: req.params.id, 'players.id': req.session.userId }).exec();
  if (!duelWeek) {
    return res.status(404).json({ message: 'Duel week not found' });
  }
  return res.json(sortGames(duelWeek));
};

function setSelections(duelWeek, pickedGames) {
  return duelWeek.games.map((game) => {
    const currentGame = pickedGames.find(pickedGame => pickedGame.id === game.id);
    if (currentGame) { game.selectedTeam = currentGame.selectedTeam; }
    return game;
  });
}

module.exports.update = async (req, res) => {
  const duelWeek = await DuelWeek.findOne({ _id: req.body._id, 'players.id': req.session.userId }).exec();
  duelWeek.games = setSelections(duelWeek, req.body.games);
  await duelWeek.save();
  return res.json({ message: 'Picks successfully locked in' });
};
