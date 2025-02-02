import mongoose from 'mongoose';

import config from '../config.ts';

import logger from './logger.ts';

mongoose.set('strictQuery', true);
mongoose.connect(`${config.MONGODB_URI}/${config.DATABASE_NAME}`);
mongoose.connection.on('error', (err) => {
  logger.error(`Unable to connect to Mongo: ${err}`);
  process.exit(1);
});

export default mongoose.connection;
