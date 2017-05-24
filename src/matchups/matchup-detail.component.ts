import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Matchup } from './matchup';

@Component({
  selector: 'matchup-detail',
  templateUrl: './matchup-detail.component.html',
  styleUrls: ['./matchup-detail.component.css'],
})
export class MatchupDetailComponent {
  @Input() matchup: Matchup;
  @Output() onPicked = new EventEmitter<string>();

  pick(team: string): void {
    this.matchup.selectedTeam = team;
  }

  isSelected(team: string): boolean {
    return this.matchup.selectedTeam === team;
  }
}
