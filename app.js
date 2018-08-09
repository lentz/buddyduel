require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
require('express-async-errors');
const winston = require('winston');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');

const routes = require('./routes');

const app = express();

const logger = winston.createLogger({
  format: winston.format.simple(),
  transports: [new winston.transports.Console()],
});

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', (err) => {
  logger.error(`Unable to connect to Mongo: ${err}`);
  process.exit(1);
});

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

module.exports = app;
