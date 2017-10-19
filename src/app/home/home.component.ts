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
  processingAccept = false;

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
        })
        .catch(err => this.toastr.error(err));
      }
    });
  }

  currentDuelWeeks(): DuelWeek[] {
    const maxWeek = Math.max(...this.duelsService.duelWeeks.map(week => week.weekNum));
    return this.duelsService.duelWeeks
      .filter(week => week.weekNum >= maxWeek - 1)
      .sort((weekA, weekB) => {
        if (weekA.weekNum !== weekB.weekNum) { return weekB.weekNum - weekA.weekNum; }

        const opponentA = this.opponentName(weekA).toUpperCase();
        const opponentB = this.opponentName(weekB).toUpperCase();
        if (opponentA < opponentB) { return -1; }
        if (opponentA > opponentB) { return 1; }
        return 0;
      });
  }

  opponentName(duelWeek: DuelWeek): string {
    return this.duelsService.opponentForPlayers(duelWeek.players);
  }

  acceptDuel(): void {
    this.processingAccept = true;
    this.duelsService.acceptDuel(this.acceptCode)
    .then(() => {
      this.acceptCode = '';
      this.processingAccept = false;
      this.toastr.success('Duel accepted!')
    })
    .catch(err => {
      this.processingAccept = false;
      this.toastr.error(err);
    });
  }

  deleteDuel(duelId): void {
    this.duelsService.deleteDuel(duelId)
    .then(() => {
      this.toastr.success('Duel deleted')
    })
    .catch(err => this.toastr.error(err));
  }
}
