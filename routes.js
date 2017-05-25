const express = require('express');
const matchupsController = require('./controllers/matchups');

const router = express.Router();

router.get('/matchups/:week', matchupsController.index);
router.put('/matchups', matchupsController.update);

module.exports = router;
