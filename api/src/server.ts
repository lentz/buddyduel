import { join } from 'node:path';

// eslint-disable-next-line import/default
import Bree from 'bree';
import * as dotenv from 'dotenv';

import app from './app';
import logger from './lib/logger';

dotenv.config();

app
  .listen(process.env.PORT)
  .on('listening', () => logger.info(`Listening on port ${process.env.PORT}`))
  .on('error', (err: any) => logger.error(err.stack));

new Bree({
  defaultExtension: process.env.TS_NODE_DEV ? 'ts' : 'js',
  jobs: [
    {
      interval: '2h',
      name: 'update-duel-weeks',
      timeout: 0,
    },
    {
      interval: '30m',
      name: 'send-pick-alerts',
      timeout: 0,
    },
  ],
  root: join(__dirname, 'jobs'),
})
  .start()
  .catch((err: any) => logger.error(err.stack));

export default app;
