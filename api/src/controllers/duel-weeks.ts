/* eslint no-param-reassign: "off" */

import { Request, Response } from 'express';
import { sortBy } from 'lodash';
import { addDays, subDays } from 'date-fns';
import { default as DuelWeek, IDuelWeek } from '../models/DuelWeek';
import IGame from '../models/IGame';

export async function index(req: Request, res: Response) {
  const filter: any = { 'players.id': req.session.userId };
  if (req.query.duelId) {
    filter.duelId = req.query.duelId;
  } else if (req.query.current) {
    filter['games.startTime'] = {
      $gt: subDays(new Date(), 1),
      $lt: addDays(new Date(), 5),
    };
  }
  res.json(await DuelWeek.find(filter).sort({ createdAt: -1 }).exec());
}

export async function show(req: Request, res: Response) {
  const duelWeek = (await DuelWeek.findOne({
    _id: req.params.id,
    'players.id': req.session.userId,
  }).exec()) as IDuelWeek;
  if (!duelWeek) {
    return res.status(404).json({ message: 'Duel week not found' });
  }
  duelWeek.games = sortBy(duelWeek.games, ['startTime', 'awayTeam']);

  return res.json(duelWeek);
}

function setSelections(duelWeek: IDuelWeek, pickedGames: IGame[]) {
  return duelWeek.games.map((game) => {
    const currentGame = pickedGames.find(
      (pickedGame) => pickedGame.id === game.id,
    );
    if (currentGame && !game.selectedTeam) {
      game.selectedTeam = currentGame.selectedTeam;
    }
    return game;
  });
}

export async function update(req: Request, res: Response) {
  const duelWeek = (await DuelWeek.findOne({
    _id: req.body._id,
    'players.id': req.session.userId,
  }).exec()) as IDuelWeek;
  if (!duelWeek) {
    return res.status(404).json({ message: 'Duel week not found' });
  }
  duelWeek.games = setSelections(duelWeek, req.body.games);
  await duelWeek.save();
  return res.json({ message: 'Picks successfully locked in' });
}
