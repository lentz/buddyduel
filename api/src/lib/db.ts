import * as dotenv from 'dotenv';
import * as mongoose from 'mongoose';
import logger from './logger';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI ?? '');
mongoose.connection.on('error', (err) => {
  logger.error(`Unable to connect to Mongo: ${err}`);
  process.exit(1);
});

export default mongoose.connection;
