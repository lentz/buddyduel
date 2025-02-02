import type { Request, Response } from 'express';

import { default as Duel, type IDuel } from '../models/Duel.ts';
import { sports } from '../sports.ts';
import * as DuelWeekUpdater from '../services/DuelWeekUpdater.ts';

async function alreadyInDuel(code: string, userId: string) {
  return (await Duel.findOne({ code, 'players.id': userId }).exec()) !== null;
}

export async function index(req: Request, res: Response) {
  const duels = await Duel.find({
    status: {
      $in: (req.query['status'] as string).split(','),
    },
    'players.id': req.session.userId,
  }).exec();

  return res.json(duels);
}

export async function show(req: Request, res: Response) {
  const duel = await Duel.findOne({
    _id: req.params['id'],
    'players.id': req.session.userId as string,
  }).exec();
  if (!duel) {
    return res.status(404).json({ message: 'Duel not found!' });
  }

  return res.json(duel);
}

export async function create(req: Request, res: Response) {
  const duel = new Duel({
    betAmount: req.body.betAmount,
    players: [
      {
        id: req.session.userId,
        name: req.session.userName,
      },
    ],
    sport: req.body.sport,
    status: 'pending',
  });

  await duel.save();

  return res.status(201).json(duel);
}

export async function update(req: Request, res: Response) {
  const updates =
    req.body.status !== undefined ? { status: req.body.status } : {};

  await Duel.findOneAndUpdate(
    {
      _id: req.params['id'],
      'players.id': req.session.userId,
    },
    updates,
  ).exec();

  return res.sendStatus(204);
}

export async function accept(req: Request, res: Response) {
  const code = req.body.code.trim();
  if (await alreadyInDuel(code, req.session.userId ?? '')) {
    throw Error('You are already in this duel!');
  }
  const duel = (await Duel.findOneAndUpdate(
    { code },
    {
      status: 'active',
      $push: {
        players: {
          id: req.session.userId as string,
          name: req.session.userName as string,
        },
      },
    },
    { new: true, runValidators: true },
  ).exec()) as IDuel;
  if (!duel) {
    throw new Error('Invalid duel code!');
  }
  await DuelWeekUpdater.call([duel]);

  return res.json({ message: 'Duel accepted!' });
}

export async function deleteDuel(req: Request, res: Response) {
  const result = await Duel.findOneAndDelete({
    _id: req.params['id'],
    status: 'pending',
    'players.id': req.session.userId,
  }).exec();
  if (!result) {
    return res.status(404).json({ message: 'Duel not found' });
  }

  return res.json({ message: 'Duel deleted' });
}

export async function getSports(_req: Request, res: Response) {
  return res.json(sports.map((sport) => sport.name));
}
