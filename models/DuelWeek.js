const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
}, { _id: false });

const duelWeekSchema = new mongoose.Schema({
  duelId: { type: mongoose.Schema.Types.ObjectId, required: true },
  year: { type: Number, required: true },
  weekNum: { type: Number, required: true },
  betAmount: { type: Number, required: true },
  players: [playerSchema],
  picker: playerSchema,
  games: [{
    _id: false,
    id: { type: String, required: true },
    homeTeam: { type: String, required: true },
    homeSpread: { type: Number, required: true },
    homeScore: Number,
    awayTeam: { type: String, required: true },
    awaySpread: { type: Number, required: true },
    awayScore: Number,
    startTime: Number,
    selectedTeam: String,
    time: String,
    result: String,
  }],
}, { timestamps: true, toJSON: { virtuals: true } });

duelWeekSchema.virtual('record').get(function getRecord() {
  let wins = 0;
  let losses = 0;
  let pushes = 0;
  this.games.forEach((game) => {
    switch (game.result) {
      case 'Win': wins += 1; break;
      case 'Loss': losses += 1; break;
      case 'Push': pushes += 1; break;
      default:
    }
  });
  return { wins, losses, pushes };
});

module.exports = mongoose.model('DuelWeek', duelWeekSchema);
