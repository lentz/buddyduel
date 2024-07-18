import { CronJob } from 'cron';

import app from './app.js';
import logger from './lib/logger.js';
import sendPickAlerts from './jobs/send-pick-alerts.js';
import updateDuelWeeks from './jobs/update-duel-weeks.js';

app
  .listen(process.env.PORT)
  .on('listening', () => logger.info(`Listening on port ${process.env.PORT}`))
  .on('error', (err: any) => logger.error(err.stack));

CronJob.from({
  cronTime: '0 0 */2 * * *', // every 2 hours
  onTick: updateDuelWeeks,
  start: true,
});

CronJob.from({
  cronTime: '0 */45 * * * *', // every 45 minutes
  onTick: sendPickAlerts,
  start: true,
});

export default app;
