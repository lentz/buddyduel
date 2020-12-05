import * as mongoose from 'mongoose';
import * as shortid from 'shortid';
import { default as PlayerSchema, IPlayer } from './PlayerSchema';

const duelSchema = new mongoose.Schema(
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

export interface IDuel extends mongoose.Document {
  id: string;
  code: string;
  createdAt: Date;
  status: 'active' | 'pending' | 'suspended';
  betAmount: number;
  players: IPlayer[];
  sport: string;
  updatedAt: string;
}

export default mongoose.model<IDuel>('Duel', duelSchema);
