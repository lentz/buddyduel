import * as mongoose from 'mongoose';
import IGame from './IGame';
import { default as PlayerSchema, IPlayer } from './PlayerSchema';

const duelWeekSchema = new mongoose.Schema({
  duelId: { type: mongoose.Schema.Types.ObjectId, required: true },
  year: { type: Number, required: true },
  description: { type: String, required: true },
  betAmount: { type: Number, required: true },
  players: [PlayerSchema],
  picker: PlayerSchema,
  skipped: { type: Boolean, default: false },
  sport: String,
  games: [{
    _id: false,
    id: { type: String, required: true },
    homeTeam: { type: String, required: true },
    homeSpread: { type: Number, required: true },
    homeScore: Number,
    awayTeam: { type: String, required: true },
    awaySpread: { type: Number, required: true },
    awayScore: Number,
    startTime: Date,
    selectedTeam: String,
    time: String,
    result: String,
  }],
}, { timestamps: true, toJSON: { virtuals: true } });

export interface IDuelWeek extends mongoose.Document {
  betAmount: number;
  games: IGame[];
  picker: IPlayer;
  players: IPlayer[];
  record: {
    losses: number;
    pushes: number;
    wins: number;
  };
  sport: string;
  description: string;
  winnings: number;
}

function calculateRecord(duelWeek: IDuelWeek) {
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

  return { wins, losses, pushes };
}

duelWeekSchema.virtual('winnings').get(function winnings(this: IDuelWeek) {
  const record = calculateRecord(this);
  return (record.wins * this.betAmount)
    - (record.losses * this.betAmount);
});

duelWeekSchema.virtual('record').get(function record(this: IDuelWeek) {
  return calculateRecord(this);
});

export default mongoose.model('DuelWeek', duelWeekSchema);
