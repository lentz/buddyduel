import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { AuthService } from '../auth/auth.service'
import { DuelsService } from '../duels/duels.service'
import { Duel } from '../duels/duel';
import { DuelWeek } from '../duels/duel-week';

declare var jQuery: any;

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  selectedDuelId: string;
  betAmount = 0;

  public constructor(public duelsService: DuelsService,
                     public authService: AuthService,
                     private toastr: ToastsManager, ) { }

  duelWeeks(): DuelWeek[] {
    return this.duelsService.duelWeeksForDuelId(this.getSelectedDuelId());
  }

  opponentName(duel: Duel): string {
    return this.duelsService.opponentForPlayers(duel.players);
  }

  getSelectedDuelId(): string {
    if (this.selectedDuelId) {
      return this.selectedDuelId;
    } else if (this.duelsService.duels.length > 0) {
      return this.duelsService.duels[0]._id;
    }
  }

  onDuelSelect(event: any, duel: Duel): void {
    event.preventDefault();
    this.selectedDuelId = duel._id;
  }

  createDuel(): void {
    this.duelsService.create(this.betAmount)
    .then(() => {
      jQuery('#create-duel-modal').modal('hide');
      this.betAmount = 0;
      this.toastr.success('Duel created!');
    })
    .catch(err => this.toastr.error(err));
  }
}
