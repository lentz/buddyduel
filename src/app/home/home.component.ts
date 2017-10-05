import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { AuthService } from '../auth/auth.service';
import { DuelsService } from '../duels/duels.service';
import { DuelWeek } from '../duels/duel-week';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  acceptCode = '';

  public constructor(public duelsService: DuelsService,
                     public authService: AuthService,
                     private titleService: Title,
                     private toastr: ToastsManager, ) { }

  ngOnInit(): void {
    this.titleService.setTitle('BuddyDuel');
    this.authService.checkSession(() => {
      if (this.authService.isAuthenticated()) {
        this.duelsService.updateDuels();
        this.duelsService.updateDuelWeeks();
      } else {
        this.authService.handleAuthentication().then(() => {
          this.duelsService.updateDuels();
          this.duelsService.updateDuelWeeks();
        });
      }
    });
  }

  currentDuels(): DuelWeek[] {
    const maxWeek = Math.max(...this.duelsService.duelWeeks.map(week => week.weekNum));
    return this.duelsService.duelWeeks.filter(week => {
      return week.weekNum >= maxWeek - 1
    });
  }

  opponentName(duelWeek: DuelWeek): string {
    return this.duelsService.opponentForPlayers(
      this.duelsService.duels.find(duel => duel._id === duelWeek.duelId).players
    );
  }

  acceptDuel(): void {
    this.duelsService.acceptDuel(this.acceptCode)
    .then(() => {
      this.acceptCode = '';
      this.toastr.success('Duel accepted!')
    })
    .catch(err => this.toastr.error(err));
  }

  deleteDuel(duelId): void {
    this.duelsService.deleteDuel(duelId)
    .then(() => {
      this.toastr.success('Duel deleted')
    })
    .catch(err => this.toastr.error(err));
  }
}
