import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { AuthService } from '../auth/auth.service'
import { DuelsService } from '../duels/duels.service'
import { Duel } from '../duels/duel';
import { DuelWeek } from '../duels/duel-week';

@Component({
  selector: 'app-nav',
  providers: [AuthService, DuelsService],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  selectedDuelId: string;
  duelWeeks: DuelWeek[];
  duels: Duel[];

  public constructor(private duelsService: DuelsService,
                     public authService: AuthService, ) { }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.getDuels();
    } else {
      this.authService.handleAuthentication().then(() => this.getDuels());
    }
  }

  getDuels(): void {
    this.duelsService.getDuels('active')
    .then((duels) => {
      this.duels = duels;
      if (duels.length > 0) {
        this.selectedDuelId = duels[0]._id
        this.updateDuelWeeks();
      }
    });
  }

  opponentName(duel: Duel): string {
    const myId = this.authService.getUserProfile().sub;
    return duel.players.find(player => player.id !== myId).name;
  }

  onDuelSelect(event: any, duel: Duel): void {
    event.preventDefault();
    this.selectedDuelId = duel._id;
    this.updateDuelWeeks();
  }

  private updateDuelWeeks(): void {
    this.duelsService.getDuelWeeks(this.selectedDuelId)
    .then(duelWeeks => this.duelWeeks = duelWeeks);
  }
}
