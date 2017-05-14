import { Injectable } from '@angular/core';

import { Matchup } from './matchup';

@Injectable()
export class MatchupsService {
  getWeek(week: number): Promise<Matchup[]> {
    return Promise.resolve([
      new Matchup(1, 'Eagles', -7, 'Chiefs', 7),
      new Matchup(2, 'Ravens', -3, 'Steelers', 3),
      new Matchup(3, 'Patriots', -6, 'Falcons', 6),
      new Matchup(4, 'Raiders', 0, 'Seahawks', 0),
    ]);
  }
}
