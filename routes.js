const express = require('express');
const gamesController = require('./controllers/games');

const router = express.Router();

router.get('/games', gamesController.index);

module.exports = router;
