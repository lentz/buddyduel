import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import logger from './logger';

dotenv.config();

mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DATABASE_NAME}`);
mongoose.connection.on('error', (err) => {
  logger.error(`Unable to connect to Mongo: ${err}`);
  process.exit(1);
});

export default mongoose.connection;
