import * as dotenv from 'dotenv';

import { job } from 'cron';
import app from './app';
import logger from './lib/logger';
import * as scoreUpdater from './services/ScoreUpdater';

dotenv.config();

job('*/30 * * * * *', () => {
  scoreUpdater.run();
}, null, true);

app.listen(process.env.PORT)
  .on('listening', () => logger.info(`Listening on port ${process.env.PORT}`))
  .on('error', logger.error);

export default app;
