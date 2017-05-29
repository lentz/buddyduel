const express = require('express');
const duelsController = require('./controllers/duels.js');
const duelWeeksController = require('./controllers/duel-weeks');

const router = express.Router();

router.get('/duels', duelsController.index);
router.post('/duels', duelsController.create);

router.get('/duel-weeks/new', duelWeeksController.new);
router.get('/duel-weeks', duelWeeksController.index);
router.get('/duel-weeks/:id', duelWeeksController.show);
router.put('/duel-weeks/:id', duelWeeksController.update);

module.exports = router;
