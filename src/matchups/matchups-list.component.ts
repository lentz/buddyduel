import { Component } from '@angular/core';

import { Matchup } from './matchup';
import { MatchupsService } from './matchups.service'

@Component({
  selector: 'matchups-list',
  providers: [MatchupsService],
  templateUrl: './matchups-list.component.html',
})
export class MatchupsListComponent {
  matchups: Matchup[];
  week = 1;
  pickedTeam = '';

  constructor(matchupsService: MatchupsService) {
    this.matchups = matchupsService.getMatchups(this.week);
  }

  onPicked(team: string) {
    this.pickedTeam = team;
  }
}
