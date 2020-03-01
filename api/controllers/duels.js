const Duel = require('../models/Duel');
const { sports } = require('../sports');
const DuelWeekUpdater = require('../services/DuelWeekUpdater');

async function alreadyInDuel(code, userId) {
  return await Duel.findOne({ code, 'players.id': userId }).exec() !== null;
}

module.exports.index = async (req, res) => {
  const duels = await Duel.find(
    { status: req.query.status.split(','), 'players.id': req.session.userId },
  ).exec();
  return res.json(duels);
};

module.exports.show = async (req, res) => {
  const duel = await Duel.findOne(
    { _id: req.params.id, 'players.id': req.session.userId },
  ).exec();
  if (!duel) { return res.status(404).json({ message: 'Duel not found!' }); }
  return res.json(duel);
};

module.exports.create = async (req, res) => {
  const duel = await Duel.create({
    betAmount: req.body.betAmount,
    players: [{ id: req.session.userId, name: req.session.userName }],
    sport: req.body.sport,
    status: 'pending',
  });
  return res.status(201).json(duel);
};

module.exports.update = async (req, res) => {
  const updates = { };
  if (req.body.status !== undefined) { updates.status = req.body.status; }
  await Duel.findOneAndUpdate(
    { _id: req.params.id, 'players.id': req.session.userId },
    updates,
  ).exec();
  return res.sendStatus(204);
};

module.exports.accept = async (req, res) => {
  const code = req.body.code.trim();
  if (await alreadyInDuel(code, req.session.userId)) {
    throw Error('You are already in this duel!');
  }
  const duel = await Duel.findOneAndUpdate(
    { code },
    { status: 'active', $push: { players: { id: req.session.userId, name: req.session.userName } } },
    { new: true, runValidators: true }
  ).exec();
  if (!duel) { throw new Error('Invalid duel code!'); }
  await DuelWeekUpdater.call([duel]);
  return res.json({ message: 'Duel accepted!' });
};

module.exports.delete = async (req, res) => {
  const result = await Duel.findOneAndRemove({
    _id: req.params.id,
    status: 'pending',
    'players.id': req.session.userId,
  }).exec();
  if (!result) { return res.status(404).json({ message: 'Duel not found' }); }
  return res.json({ message: 'Duel deleted' });
};

module.exports.getSports = async (req, res) => res.json(sports.map(sport => sport.name));
