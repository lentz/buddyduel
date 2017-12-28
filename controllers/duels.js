const Duel = require('../models/Duel');
const DuelWeekUpdater = require('../services/DuelWeekUpdater');
const user = require('../services/user');

async function alreadyInDuel(code, userId) {
  return await Duel.findOne({ code, 'players.id': userId }).exec() !== null;
}

module.exports.index = async (req, res) => {
  const duels = await Duel.find(
    Object.assign(req.query, { 'players.id': req.user.sub })
  ).exec();
  return res.json(duels);
};

module.exports.create = async (req, res) => {
  const userName = (await user.getInfo(req.user.sub)).name;
  const duel = await Duel.create({
    players: [{ id: req.user.sub, name: userName }],
    status: 'pending',
    betAmount: req.body.betAmount,
  });
  return res.status(201).json(duel);
};

module.exports.accept = async (req, res) => {
  const code = req.body.code.trim();
  if (await alreadyInDuel(code, req.user.sub)) {
    throw Error('You are already in this duel!');
  }
  const userName = (await user.getInfo(req.user.sub)).name;
  const duel = await Duel.findOneAndUpdate(
    { code },
    { status: 'active', $push: { players: { id: req.user.sub, name: userName } } },
    { new: true, runValidators: true }
  ).exec();
  await DuelWeekUpdater.call([duel]);
  return res.json({ message: 'Duel accepted!' });
};

module.exports.delete = async (req, res) => {
  const result = await Duel.findOneAndRemove({
    _id: req.params.id,
    status: 'pending',
    'players.id': req.user.sub,
  }).exec();
  if (!result) { return res.status(404).json({ message: 'Duel not found' }); }
  return res.json({ message: 'Duel deleted' });
};
