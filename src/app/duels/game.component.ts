import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Game } from './game';

@Component({
  selector: 'duel-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent {
  @Input() game: Game;
  @Input() isPicker: boolean;

  isReadOnly(): boolean {
    return !this.isPicker || this.gameHasStarted() || this.selectionSaved();
  }

  pick(team: string): void {
    this.game.updated = true;
    if (this.game.selectedTeam === team) {
      this.game.selectedTeam = undefined;
    } else {
      this.game.selectedTeam = team;
    }
  }

  isSelected(team: string): boolean {
    return this.game.selectedTeam === team;
  }

  private selectionSaved(): boolean {
    return this.game.selectedTeam && !this.game.updated;
  }

  private gameHasStarted(): boolean {
    return this.game.startTime < +new Date();
  }
}
