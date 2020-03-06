import * as express from 'express';
import * as duelsController from './controllers/duels';
import * as duelWeeksController from './controllers/duel-weeks';
import * as usersController from './controllers/users';

const router = express.Router();

router.all('*', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!req.session || !req.session.userId) {
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
  .delete(duelsController.deleteDuel);

router.route('/duel-weeks')
  .get(duelWeeksController.index);
router.route('/duel-weeks/:id')
  .get(duelWeeksController.show)
  .put(duelWeeksController.update);

router.route('/profile')
  .get(usersController.show)
  .put(usersController.update);

export default router;