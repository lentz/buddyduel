import path from 'node:path';
import { fileURLToPath } from 'node:url';

import Bree from 'bree';

import app from './app.js';
import logger from './lib/logger.js';

app
  .listen(process.env.PORT)
  .on('listening', () => logger.info(`Listening on port ${process.env.PORT}`))
  .on('error', (err: any) => logger.error(err.stack));

const bree = new Bree({
  defaultExtension: /dev/.test(process.env.DATABASE_NAME ?? '') ? 'ts' : 'js',
  jobs: [
    {
      interval: 'every 2 hours',
      name: 'update-duel-weeks',
      timeout: 0,
    },
    {
      interval: 'every 45 minutes',
      name: 'send-pick-alerts',
      timeout: '10m',
    },
  ],
  root: path.join(path.dirname(fileURLToPath(import.meta.url)), 'jobs'),
});
await bree.start();

export default app;
