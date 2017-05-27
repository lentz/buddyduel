const express = require('express');
const duelWeeksController = require('./controllers/duel-weeks');

const router = express.Router();

router.get('/duel-weeks', duelWeeksController.index);
router.get('/duel-weeks/:id', duelWeeksController.show);
router.put('/duel-weeks/:id', duelWeeksController.update);

module.exports = router;
