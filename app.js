const express = require('express');
const routes = require('./routes');
const morgan = require('morgan');

const app = express();

app.use(morgan('combined'));
app.use('/', routes);

app.listen(process.env.PORT || 3000);

module.exports = app;
