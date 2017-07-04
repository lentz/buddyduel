import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Game } from './game';

@Component({
  selector: 'duel-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent {
  @Input() game: Game;
  @Output() onPicked = new EventEmitter<string>();

  pick(team: string): void {
    if (this.game.selectedTeam === team) {
      this.game.selectedTeam = undefined;
    } else {
      this.game.selectedTeam = team;
    }
  }

  isSelected(team: string): boolean {
    return this.game.selectedTeam === team;
  }
}
