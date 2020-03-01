import * as mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
}, { _id: false });

export interface IPlayer {
  id: string;
  name: string;
}

export default playerSchema;
