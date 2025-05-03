import type { Request, Response } from 'express';
import { addDays, subDays } from 'date-fns';

import { default as DuelWeek, type IDuelWeek } from '../models/DuelWeek.ts';
import type IGame from '../models/IGame.ts';

export async function index(req: Request, res: Response) {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const filter: any = { 'players.id': req.session.userId };
  if (req.query['duelId']) {
    filter.duelId = req.query['duelId'];
  } else if (req.query['current']) {
    filter['games.startTime'] = {
      $gt: subDays(new Date(), 1),
      $lt: addDays(new Date(), 5),
    };
  }
  res.json(await DuelWeek.find(filter).sort({ createdAt: -1 }).exec());
}

export async function show(req: Request, res: Response) {
  const duelWeek = (await DuelWeek.findOne({
    _id: req.params['id'],
    'players.id': req.session.userId,
  }).exec()) as IDuelWeek;

  if (!duelWeek) {
    res.status(404).json({ message: 'Duel week not found' });
    return;
  }

  duelWeek.games.sort((game1, game2) => {
    if (game1.startTime < game2.startTime) return -1;
    if (game1.startTime > game2.startTime) return 1;

    // If startTimes are equal, sort by awayTeam
    return game1.awayTeam.localeCompare(game2.awayTeam);
  });

  res.json(duelWeek);
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
    res.status(404).json({ message: 'Duel week not found' });
    return;
  }
  duelWeek.games = setSelections(duelWeek, req.body.games);
  await duelWeek.save();
  res.json({ message: 'Picks successfully locked in' });
}
