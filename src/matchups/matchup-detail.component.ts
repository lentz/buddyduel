import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Matchup } from './matchup';

@Component({
  selector: 'matchup-detail',
  templateUrl: './matchup-detail.component.html',
})
export class MatchupDetailComponent {
  @Input() matchup: Matchup;
  @Output() onPicked = new EventEmitter<string>();

  pick(team: string) {
    this.onPicked.emit(team);
  }
}
