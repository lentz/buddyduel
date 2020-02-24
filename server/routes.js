const express = require('express');

const duelsController = require('./controllers/duels.js');
const duelWeeksController = require('./controllers/duel-weeks');
const usersController = require('./controllers/users');

const router = express.Router();

router.all('*', (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'You are not logged in' });
  }
  return next();
});

router.route('/duels')
  .get(duelsController.index)
  .post(duelsController.create);
router.route('/duels/accept')
  .put(duelsController.accept);
router.route('/duels/sports')
  .get(duelsController.getSports);
router.route('/duels/:id')
  .get(duelsController.show)
  .put(duelsController.update)
  .delete(duelsController.delete);

router.route('/duel-weeks')
  .get(duelWeeksController.index);
router.route('/duel-weeks/:id')
  .get(duelWeeksController.show)
  .put(duelWeeksController.update);

router.route('/profile')
  .get(usersController.show)
  .put(usersController.update);

module.exports = router;
