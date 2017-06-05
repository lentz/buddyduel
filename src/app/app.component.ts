import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { AuthService } from '../auth/auth.service'
import { DuelsService } from '../duels/duels.service'
import { Duel } from '../duels/duel';

@Component({
  selector: 'app-root',
  providers: [AuthService, DuelsService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  selectedDuelId: string;
  duelWeekIds: string[];
  duels: Duel[];

  public constructor(private titleService: Title,
                     private duelsService: DuelsService,
                     public authService: AuthService, ) { }

  ngOnInit(): void {
    // FIXME: Make this work
    this.titleService.setTitle('BuddyDuel');
    if (this.authService.isAuthenticated()) {
      this.getDuels();
    } else {
      this.authService.handleAuthentication().then(() => this.getDuels());
    }
  }

  getDuels(): void {
    this.duelsService.getDuels()
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
    return duel.players.find(player => player.id !== myId).id;
  }

  onDuelSelect(event: any, duel: Duel): void {
    event.preventDefault();
    this.selectedDuelId = duel._id;
    this.updateDuelWeeks();
  }

  private updateDuelWeeks(): void {
    this.duelsService.getDuelWeekIds(this.selectedDuelId)
    .then(duelWeekIds => this.duelWeekIds = duelWeekIds);
  }
}
