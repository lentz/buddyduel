const express = require('express');
const matchupsController = require('./controllers/matchups');

const router = express.Router();

router.get('/matchups/:week', matchupsController.index);

module.exports = router;
