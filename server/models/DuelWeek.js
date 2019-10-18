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
  winnings: { type: Number, default: 0 },
  skipped: { type: Boolean, default: false },
  record: {
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    pushes: { type: Number, default: 0 },
  },
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

duelWeekSchema.method('updateRecord', function updateRecord() {
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
  this.record = { wins, losses, pushes };
  this.winnings = (this.record.wins * this.betAmount)
                  - (this.record.losses * this.betAmount);
});

module.exports = mongoose.model('DuelWeek', duelWeekSchema);
