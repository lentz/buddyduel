import type { Request, Response } from 'express';

import { default as Duel, type IDuel } from '../models/Duel.ts';
import * as DuelWeekUpdater from '../services/DuelWeekUpdater.ts';
import { sports } from '../sports.ts';

async function alreadyInDuel(code: string, userId: string) {
  return (await Duel.findOne({ code, 'players.id': userId }).exec()) !== null;
}

export async function index(
  req: Request<null, null, null, { status: string }>,
  res: Response,
) {
  const duels = await Duel.find({
    status: {
      $in: req.query.status.split(','),
    },
    'players._id': req.session.userId,
  }).exec();

  res.json(duels);
}

export async function show(req: Request<{ id: string }>, res: Response) {
  const duel = await Duel.findOne({
    _id: req.params.id,
    'players._id': req.session.userId,
  }).exec();
  if (!duel) {
    res.status(404).json({ message: 'Duel not found!' });
    return;
  }

  res.json(duel);
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

  res.status(201).json(duel);
}

export async function update(req: Request<{ id: string }>, res: Response) {
  const updates =
    req.body.status !== undefined ? { status: req.body.status } : {};

  await Duel.findOneAndUpdate(
    {
      _id: req.params.id,
      'players._id': req.session.userId,
    },
    updates,
  ).exec();

  res.sendStatus(204);
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

  res.json({ message: 'Duel accepted!' });
}

export async function deleteDuel(req: Request<{ id: string }>, res: Response) {
  const result = await Duel.findOneAndDelete({
    _id: req.params.id,
    status: 'pending',
    'players._id': req.session.userId,
  }).exec();
  if (!result) {
    res.status(404).json({ message: 'Duel not found' });
    return;
  }

  res.json({ message: 'Duel deleted' });
}

export async function getSports(_req: Request, res: Response) {
  res.json(sports.map((sport) => sport.name));
}
