import * as dotenv from 'dotenv';

import app from './app';
import logger from './lib/logger';

dotenv.config();

app
  .listen(process.env.PORT)
  .on('listening', () => logger.info(`Listening on port ${process.env.PORT}`))
  .on('error', logger.error);

export default app;
