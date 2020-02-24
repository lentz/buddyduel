require('dotenv').config();
const { job } = require('cron');
const app = require('./app');
const logger = require('./lib/logger');
const scoreUpdater = require('./services/ScoreUpdater');

job('*/30 * * * * *', () => {
  scoreUpdater.run();
}, null, true);

app.listen(process.env.PORT)
  .on('listening', () => logger.info(`Listening on port ${process.env.PORT}`))
  .on('error', logger.error);

module.exports = app;
