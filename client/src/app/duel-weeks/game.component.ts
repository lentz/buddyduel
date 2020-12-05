import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Game } from './game';

@Component({
  selector: 'duel-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent {
  @Input() game!: Game;
  @Input() isPicker!: boolean;

  isReadOnly(): boolean {
    return (
      !this.isPicker ||
      Game.hasStarted(this.game) ||
      this.selectionSaved() ||
      this.game.homeSpread === undefined
    );
  }

  pick(team: string): void {
    this.game.updated = true;
    this.game.selectedTeam = team;
  }

  clear(): void {
    this.game.selectedTeam = undefined;
  }

  showClear(): boolean {
    return this.game.updated && this.game.selectedTeam !== undefined;
  }

  isSelected(team: string): boolean {
    return this.game.selectedTeam === team;
  }

  logoPath(teamName: string): string {
    return `team-logos/${teamName.replace(/\s+/g, '-').toLowerCase()}.png`;
  }

  private selectionSaved(): boolean {
    return (
      this.game.selectedTeam !== undefined &&
      this.game.selectedTeam !== '' &&
      !this.game.updated
    );
  }
}
