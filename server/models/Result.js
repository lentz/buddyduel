const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  year: { type: Number, required: true },
  weekNum: { type: Number, required: true },
  scores: [{
    _id: false,
    gameId: { type: String, required: true },
    homeScore: { type: Number, required: true },
    awayScore: { type: Number, required: true },
    time: { type: String, required: true },
  }],
}, { timestamps: true });

module.exports = mongoose.model('Result', resultSchema);
