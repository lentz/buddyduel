import { CronJob } from 'cron';

import app from './app.ts';
import config from './config.ts';
import sendPickAlerts from './jobs/send-pick-alerts.ts';
import updateDuelWeeks from './jobs/update-duel-weeks.ts';
import logger from './lib/logger.ts';

app
  .listen(config.PORT)
  .on('listening', () => logger.info(`Listening on port ${config.PORT}`))
  .on('error', (err: Error) => logger.error(err.stack));

CronJob.from({
  cronTime: '0 0 * * * 0', // hourly on Sundays
  onTick: updateDuelWeeks,
  start: true,
});

CronJob.from({
  cronTime: '0 0 */2 * * 1-6', // every two hours Monday through Saturday
  onTick: updateDuelWeeks,
  start: true,
});

CronJob.from({
  cronTime: '0 */45 * * * *', // every 45 minutes
  onTick: sendPickAlerts,
  start: true,
});

export default app;
