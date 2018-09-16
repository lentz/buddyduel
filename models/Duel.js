const mongoose = require('mongoose');
const shortid = require('shortid');

const playerSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
}, { _id: false });

const duelSchema = new mongoose.Schema({
  code: { type: String, default: shortid.generate },
  status: { type: String, enum: ['active', 'pending', 'suspended'], required: true },
  betAmount: { type: Number, required: true },
  players: [{ type: playerSchema, required: true }],
}, { timestamps: true });

module.exports = mongoose.model('Duel', duelSchema);
