require('dotenv').config();
const bodyParser = require('body-parser');
const { job } = require('cron');
const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
require('express-async-errors');
const morgan = require('morgan');
const path = require('path');

const usersController = require('./controllers/users');
const logger = require('./lib/logger');
const nflScoreUpdater = require('./services/NFLScoreUpdater');
const routes = require('./routes');
require('./lib/db');

const app = express();

app.use(morgan('combined'));

const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: 'sessions',
});
store.on('error', err => logger.error(err));

app.use(session({
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
    secure: process.env.BASE_URL.startsWith('https'),
  },
  store,
  resave: true,
  saveUninitialized: false,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'pug');

app.get('/auth/callback', usersController.authenticate);
app.get('/logout', usersController.logout);
app.use('/api', routes);
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.use((err, req, res, _next) => {
  logger.error(err.stack);
  if (err.response) { logger.error(err.response.data); }
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
