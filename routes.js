const express = require('express');
const matchupsController = require('./controllers/matchups');

const router = express.Router();

router.get('/matchups/:id', matchupsController.show);
router.put('/matchups/:id', matchupsController.update);

module.exports = router;
