import mongoose from 'mongoose';
import shortid from 'shortid';

import { default as PlayerSchema, IPlayer } from './PlayerSchema.js';

export interface IDuel {
  id: string;
  code: string;
  createdAt: Date;
  status: 'active' | 'pending' | 'suspended';
  betAmount: number;
  players: IPlayer[];
  sport: string;
  updatedAt: string;
}

const duelSchema = new mongoose.Schema<IDuel>(
  {
    code: { type: String, default: shortid.generate },
    status: {
      type: String,
      enum: ['active', 'pending', 'suspended'],
      required: true,
    },
    betAmount: { type: Number, required: true },
    players: [{ type: PlayerSchema, required: true }],
    sport: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model<IDuel>('Duel', duelSchema);
