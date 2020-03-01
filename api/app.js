require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
require('express-async-errors');
const morgan = require('morgan');
const path = require('path');

const usersController = require('./controllers/users');
const logger = require('./lib/logger');
const routes = require('./routes');
require('./lib/db');

const app = express();

app.use(morgan('combined'));
app.set('trust proxy', 1);

const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: 'sessions',
});
store.on('error', err => logger.error(err));

app.use(session({
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
    secure: false,
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
app.use(express.static(path.join(__dirname, '..', 'client', 'public')));
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'public', 'index.html'));
});
app.use((err, req, res, _next) => {
  logger.error(err.stack);
  if (err.response) { logger.error(err.response.data); }
  res.status(500).json({ message: err.message });
});

module.exports = app;
