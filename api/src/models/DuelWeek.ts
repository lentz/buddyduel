import * as mongoose from 'mongoose';

import type IGame from './IGame.ts';
import { type IPlayer, default as PlayerSchema } from './PlayerSchema.ts';

const GameSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    homeTeam: { type: String, required: true },
    homeSpread: Number,
    homeScore: Number,
    awayTeam: { type: String, required: true },
    awaySpread: Number,
    awayScore: Number,
    startTime: { type: Date, required: true },
    selectedTeam: String,
    time: String,
    result: String,
  },
  { _id: false },
);

const duelWeekSchema = new mongoose.Schema(
  {
    betAmount: { type: Number, required: true },
    description: { type: String, required: true },
    duelId: { type: mongoose.Schema.Types.ObjectId, required: true },
    games: [GameSchema],
    picker: PlayerSchema,
    players: [PlayerSchema],
    skipped: { type: Boolean, default: false },
    sport: String,
    year: { type: Number, required: true },
  },
  { timestamps: true, toJSON: { virtuals: true } },
);

export interface IDuelWeek extends mongoose.Document {
  betAmount: number;
  description: string;
  duelId: string;
  games: IGame[];
  picker: IPlayer | undefined;
  players: IPlayer[];
  record: {
    losses: number;
    pushes: number;
    wins: number;
  };
  sport: string;
  winnings: number;
  year: number;
}

function calculateRecord(duelWeek: IDuelWeek) {
  let wins = 0;
  let losses = 0;
  let pushes = 0;

  duelWeek.games.forEach((game) => {
    switch (game.result) {
      case 'Win':
        wins += 1;
        break;
      case 'Loss':
        losses += 1;
        break;
      case 'Push':
        pushes += 1;
        break;
      default:
    }
  });

  return { wins, losses, pushes };
}

duelWeekSchema.virtual('winnings').get(function winnings(this: IDuelWeek) {
  const record = calculateRecord(this);
  return record.wins * this.betAmount - record.losses * this.betAmount;
});

duelWeekSchema.virtual('record').get(function record(this: IDuelWeek) {
  return calculateRecord(this);
});

export default mongoose.model<IDuelWeek>('DuelWeek', duelWeekSchema);
