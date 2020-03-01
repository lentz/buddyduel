import * as dotenv from 'dotenv';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as session from 'express-session';
import connectMongodbSession = require('connect-mongodb-session');
import 'express-async-errors';
import * as morgan from 'morgan';
import * as path from 'path';
import * as usersController from './controllers/users';
import logger from './lib/logger';
import routes from './routes';
import './lib/db';

dotenv.config();

const app = express();

app.use(morgan('combined'));
app.set('trust proxy', 1);

const MongoDBStore = connectMongodbSession(session);
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI || '',
  collection: 'sessions',
});
store.on('error', (err: any) => logger.error(err));

app.use(session({
  secret: process.env.SESSION_SECRET || '',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
    secure: false,
  },
  store,
  resave: true,
  saveUninitialized: false,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'pug');

app.get('/auth/callback', usersController.authenticate);
app.get('/logout', usersController.logout);
app.use('/api', routes);
app.use(express.static(path.join(__dirname, '..', '..', 'client', 'public')));
app.get('*', (_req: express.Request, res: express.Response) => {
  res.sendFile(path.join(__dirname, '..', '..', 'client', 'public', 'index.html'));
});
app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error(err.stack);
  if (err.response) { logger.error(err.response.data); }
  res.status(500).json({ message: err.message });
});

export default app;
