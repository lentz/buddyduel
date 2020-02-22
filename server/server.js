require('dotenv').config();
const { job } = require('cron');
const app = require('./app');
const logger = require('./lib/logger');
const nflScoreUpdater = require('./services/NFLScoreUpdater');

// Disabling pending replacement for NFL.com scores
nflScoreUpdater.on('error', (err) => {
  logger.error(`Error updating NFL scores: ${err}`);
});
job('*/30 * * * 0,1,8-11 *', () => {
//   nflScoreUpdater.run();
}, null, true);


app.listen(process.env.PORT)
  .on('listening', () => logger.info(`Listening on port ${process.env.PORT}`))
  .on('error', logger.error);

module.exports = app;
