require('dotenv').config();
const bodyParser = require('body-parser');
const { job } = require('cron');
const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const path = require('path');

const logger = require('./lib/logger');
const nflScoreUpdater = require('./services/NFLScoreUpdater');
const routes = require('./routes');
require('./lib/db');

const app = express();

app.use(morgan('combined'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'pug');

app.get('/silent', (req, res) => {
  res.render('silent', { redirectUri: process.env.BASE_URL });
});

app.use('/api', routes);
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.use((err, req, res, _next) => {
  logger.error(err);
  res.status(500).json({ message: err.message });
});

app.listen(process.env.PORT)
  .on('listening', () => logger.info(`Listening on port ${process.env.PORT}`))
  .on('error', logger.error);

nflScoreUpdater.on('error', logger.error);
job('*/30 * * * 0,1,8-11 *', () => {
  nflScoreUpdater.run();
}, null, true);

module.exports = app;
