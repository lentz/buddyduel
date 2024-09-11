import { z } from 'zod';

const schema = z.object({
  ADMIN_EMAIL: z.string().email(),
  AUTH0_CLIENT_ID: z.string(),
  AUTH0_CLIENT_SECRET: z.string(),
  BUDDYDUEL_URL: z.string().url(),
  CLIENT_DIST_PATH: z.string().default('../client/dist/buddyduel/browser'),
  DATABASE_NAME: z.string(),
  MONGODB_URI: z.string().url(),
  ODDS_API_KEY: z.string(),
  PORT: z.coerce.number().default(3000),
  SENDGRID_API_KEY: z.string(),
  SESSION_SECRET: z.string(),
});

export default schema.parse(process.env);
