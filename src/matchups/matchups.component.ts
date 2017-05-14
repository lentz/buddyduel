import { Component } from '@angular/core';

import { Matchup } from './matchup';
import { MatchupsService } from './matchups.service'

@Component({
  selector: 'app-matchups',
  providers: [MatchupsService],
  templateUrl: './matchups.component.html',
})
export class MatchupsComponent {
  matchups: Matchup[];
  week = 1;
  pickedTeam = '';

  constructor(matchupsService: MatchupsService) {
    this.matchups = matchupsService.getMatchups(this.week);
  }

  onPickTeam(team: string) {
    this.pickedTeam = team;
  }
}
