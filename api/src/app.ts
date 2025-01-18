import path from 'node:path';

import bodyParser from 'body-parser';
import express from 'express';
import session from 'express-session';
import connectMongodbSession from 'connect-mongodb-session';
import 'express-async-errors';
import morgan from 'morgan';

import config from './config.js';
import * as usersController from './controllers/users.js';
import logger from './lib/logger.js';
import routes from './routes.js';
import './lib/db.js';

const app = express();

if (!process.env['VITEST']) app.use(morgan('combined'));

app.set('trust proxy', 1);

declare module 'express-session' {
  interface SessionData {
    userName: string;
    userId: string;
  }
}

const MongoDBStore = connectMongodbSession(session);
const store = new MongoDBStore({
  uri: `${config.MONGODB_URI}/${config.DATABASE_NAME}`,
  collection: 'sessions',
});
store.on('error', (err: Error) => logger.error(err));

app.use(
  session({
    secret: config.SESSION_SECRET,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
      secure: false,
    },
    store,
    resave: true,
    saveUninitialized: false,
  }),
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/auth/callback', usersController.authenticate);
app.get('/logout', usersController.logout);
app.use('/api', routes);
app.use(
  express.static(path.resolve(config.CLIENT_DIST_PATH), {
    maxAge: 31556926000,
  }),
);
app.get('*', (_req: express.Request, res: express.Response) => {
  res.sendFile(path.join(path.resolve(config.CLIENT_DIST_PATH), 'index.html'));
});
app.use(
  (
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    logger.error(err);
    if (err.response) {
      logger.error(JSON.stringify(err.response.data, null, 2));
    }
    res.status(500).json({ message: err.message });
  },
);

export default app;
