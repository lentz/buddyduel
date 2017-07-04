require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const logger = require('winston');

const routes = require('./routes');
const db = require('./db');

const app = express();

app.use(morgan('combined'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', routes);
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

db.connect(process.env.MONGODB_URI, (err) => {
  if (err) {
    logger.error('Unable to connect to Mongo');
    process.exit(1);
  }
  app.listen(process.env.PORT || 3000);
});

module.exports = app;
