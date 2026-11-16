import app from './app.ts';
import config from './config.ts';
import logger from './lib/logger.ts';

app
  .listen(config.PORT)
  .on('listening', () => logger.info(`Listening on port ${config.PORT}`))
  .on('error', (err: Error) => logger.error(err.stack));

export default app;
