import mongoose from 'mongoose';

import config from '../config.js';

import logger from './logger.js';

mongoose.set('strictQuery', true);
mongoose.connect(`${config.MONGODB_URI}/${config.DATABASE_NAME}`);
mongoose.connection.on('error', (err) => {
  logger.error(`Unable to connect to Mongo: ${err}`);
  process.exit(1);
});

export default mongoose.connection;
