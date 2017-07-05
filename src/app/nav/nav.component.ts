import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { AuthService } from '../auth/auth.service'
import { DuelsService } from '../duels/duels.service'
import { Duel } from '../duels/duel';
import { DuelWeek } from '../duels/duel-week';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  selectedDuelId: string;

  public constructor(public duelsService: DuelsService,
                     public authService: AuthService, ) { }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.duelsService.updateDuels();
      this.duelsService.updateDuelWeeks();
    } else {
      this.authService.handleAuthentication().then(() => {
        this.duelsService.updateDuels();
        this.duelsService.updateDuelWeeks();
      });
    }
  }

  duelWeeks(): DuelWeek[] {
    return this.duelsService.duelWeeksForDuelId(this.getSelectedDuelId());
  }

  opponentName(duel: Duel): string {
    return this.duelsService.opponentForDuel(duel);
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
}
