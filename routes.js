const express = require('express');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const duelsController = require('./controllers/duels.js');
const duelWeeksController = require('./controllers/duel-weeks');
const usersController = require('./controllers/users');

const router = express.Router();

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://app68395404.auth0.com/.well-known/jwks.json',
  }),

  audience: 'http://www.buddyduel.net/api',
  issuer: 'https://app68395404.auth0.com/',
  algorithms: ['RS256'],
});

router.use(checkJwt);
router.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ message: `Unauthorized: ${err.message}` });
  }
});

router.route('/duels')
  .get(duelsController.index)
  .post(duelsController.create);
router.route('/duels/:id')
  .delete(duelsController.delete);
router.route('/duels/accept')
  .put(duelsController.accept);

router.route('/duel-weeks')
  .get(duelWeeksController.index);
router.route('/duel-weeks/:id')
  .get(duelWeeksController.show)
  .put(duelWeeksController.update);

router.route('/profile')
  .get(usersController.show)
  .put(usersController.update);

module.exports = router;
