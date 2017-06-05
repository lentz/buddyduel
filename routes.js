const express = require('express');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const duelsController = require('./controllers/duels.js');
const duelWeeksController = require('./controllers/duel-weeks');

const router = express.Router();

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://app68395404.auth0.com/.well-known/jwks.json`
  }),

  audience: 'http://www.buddyduel.net/api',
  issuer: `https://app68395404.auth0.com/`,
  algorithms: ['RS256']
});

router.use(checkJwt);
router.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ message: `Unauthorized: ${err.message}` });
  }
});

router.get('/duels', duelsController.index);
router.post('/duels', duelsController.create);
router.put('/duels/:id/accept', duelsController.accept);

router.get('/duel-weeks/new', duelWeeksController.new);
router.get('/duel-weeks', duelWeeksController.index);
router.get('/duel-weeks/:id', duelWeeksController.show);
router.put('/duel-weeks/:id', duelWeeksController.update);

module.exports = router;
