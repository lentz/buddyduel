/* eslint-disable no-param-reassign, @typescript-eslint/camelcase */

import { NextFunction, Request, Response } from 'express';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
import { default as DuelWeek, IDuelWeek } from '../models/DuelWeek';
import * as user from '../services/user';

const COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 365; // 1 year
const USE_SECURE_COOKIE = (process.env.BASE_URL || '').startsWith('https');

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
  const response = await axios.post(
    `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
    {
      grant_type: 'authorization_code',
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      code: req.query.code,
      redirect_uri: `${process.env.BASE_URL}/auth/callback`,
    },
    {
      headers: { 'content-type': 'application/json' },
    },
  );
  const jwt = jwtDecode(response.data.id_token) as {
    sub: string;
    name: string;
  };
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
  req.session.save(next);
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  res.clearCookie('connect.sid', { secure: USE_SECURE_COOKIE });
  res.clearCookie('userId', { secure: USE_SECURE_COOKIE });
  res.clearCookie('userName', { secure: USE_SECURE_COOKIE });
  req.session.destroy(next);
}

export async function show(req: Request, res: Response) {
  return res.json(
    Object.assign(
      await getPerformance(req.session.userId ?? ''),
      await getPreferences(req.session.userId ?? ''),
    ),
  );
}

export async function update(req: Request, res: Response) {
  await user.updateMetadata(req.session.userId ?? '', req.body);
  return res.status(204).send();
}
