const express = require('express');
const routes = require('./routes');
const morgan = require('morgan');
const path = require('path');

const app = express();

app.use(morgan('combined'));

app.use('/api', routes);
app.use(express.static(path.join(__dirname, 'dist')));
app.get('/', (_req, res) => {
  res.sendfile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(process.env.PORT || 3000);

module.exports = app;
