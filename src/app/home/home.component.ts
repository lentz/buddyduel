import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Subscription } from 'rxjs/Subscription';

import { AuthService } from '../auth/auth.service';
import { Duel } from '../duels/duel';
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
  currentDuelWeeks: DuelWeek[] = [];
  pendingDuels: Duel[] = [];
  duelCreatedSubscription: Subscription;

  public constructor(private duelsService: DuelsService,
                     public authService: AuthService,
                     private titleService: Title,
                     private toastr: ToastsManager, ) {
    this.duelCreatedSubscription = duelsService.duelCreated$.subscribe(
      duel => this.pendingDuels.push(duel)
    );
  }

  ngOnInit(): void {
    this.titleService.setTitle('BuddyDuel');
    this.authService.checkSession(() => {
      if (this.authService.isAuthenticated()) {
        this.updateDuelWeeks();
        this.updatePendingDuels();
      } else {
        this.authService.handleAuthentication().then(() => {
          this.updateDuelWeeks();
          this.updatePendingDuels();
        })
        .catch(err => this.toastr.error(err));
      }
    });
  }

  private updateDuelWeeks(): void {
    this.duelsService.getDuelWeeks({ current: true })
      .then(duelWeeks => this.currentDuelWeeks = duelWeeks)
      .catch(err => this.toastr.error(err));
  }

  private updatePendingDuels(): void {
    this.duelsService.getDuels({ status: 'pending' })
      .then(duels => this.pendingDuels = duels)
      .catch(err => this.toastr.error(err));
  }

  opponentName(duelWeek: DuelWeek): string {
    return this.duelsService.opponentForPlayers(duelWeek.players);
  }

  acceptDuel(): void {
    this.processingAccept = true;
    this.duelsService.acceptDuel(this.acceptCode)
    .then(() => {
      this.updateDuelWeeks();
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
      this.pendingDuels = this.pendingDuels.filter(duel => duel._id !== duelId);
      this.toastr.success('Duel deleted')
    })
    .catch(err => this.toastr.error(err));
  }
}
