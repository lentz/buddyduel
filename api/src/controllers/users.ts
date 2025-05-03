import type { NextFunction, Request, Response } from 'express';
import { jwtDecode } from 'jwt-decode';

import config from '../config.ts';
import { default as DuelWeek, type IDuelWeek } from '../models/DuelWeek.ts';
import * as user from '../services/user.ts';

const COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 365; // 1 year
const USE_SECURE_COOKIE = config.BUDDYDUEL_URL.startsWith('https');

async function getPerformance(userId: string) {
  const duelWeeks = (await DuelWeek.find({
    'picker.id': userId,
  }).exec()) as IDuelWeek[];
  return duelWeeks.reduce(
    (performance, duelWeek) => {
      performance.winnings += duelWeek.winnings;
      performance.record.wins += duelWeek.record.wins;
      performance.record.losses += duelWeek.record.losses;
      performance.record.pushes += duelWeek.record.pushes;
      return performance;
    },
    { winnings: 0, record: { wins: 0, losses: 0, pushes: 0 } },
  );
}

async function getPreferences(userId: string) {
  return {
    preferences: Object.assign(
      { reminderEmails: true },
      (await user.getInfo(userId)).user_metadata || {},
    ),
  };
}

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const response = await fetch(`https://${user.AUTH0_DOMAIN}/oauth/token`, {
    body: JSON.stringify({
      grant_type: 'authorization_code',
      client_id: config.AUTH0_CLIENT_ID,
      client_secret: config.AUTH0_CLIENT_SECRET,
      code: req.query['code'],
      redirect_uri: `${config.BUDDYDUEL_URL}/auth/callback`,
    }),
    headers: { 'content-type': 'application/json' },
    method: 'POST',
  });

  if (!response.ok) {
    return next(new Error(`Failed to get token: ${await response.text()}`));
  }

  const responseBody = await response.json();
  const jwt = jwtDecode<{ name: string; sub: string }>(responseBody.id_token);

  if (!req.session) {
    return next(new Error('No session!'));
  }
  req.session.userId = jwt.sub;
  req.session.userName = jwt.name;
  res.cookie('userId', jwt.sub, {
    maxAge: COOKIE_MAX_AGE,
    secure: USE_SECURE_COOKIE,
  });
  res.cookie('userName', jwt.name, {
    maxAge: COOKIE_MAX_AGE,
    secure: USE_SECURE_COOKIE,
  });
  req.session.save(() => {
    res.redirect('/');
  });
}

export async function logout(req: Request, res: Response) {
  res.clearCookie('connect.sid', { secure: USE_SECURE_COOKIE });
  res.clearCookie('userId', { secure: USE_SECURE_COOKIE });
  res.clearCookie('userName', { secure: USE_SECURE_COOKIE });
  req.session.destroy(() => {
    res.redirect('/');
  });
}

export async function show(req: Request, res: Response) {
  res.json(
    Object.assign(
      await getPerformance(req.session.userId ?? ''),
      await getPreferences(req.session.userId ?? ''),
    ),
  );
}

export async function update(req: Request, res: Response) {
  await user.updateMetadata(req.session.userId ?? '', req.body);
  res.status(204).send();
}
