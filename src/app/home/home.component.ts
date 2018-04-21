import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
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
export class HomeComponent implements OnDestroy, OnInit {
  acceptCode = '';
  processingAccept = false;
  currentDuelWeeks: DuelWeek[] = [];
  pendingDuels: Duel[] = [];
  duelCreatedSubscription: Subscription;
  authenticatedSubscription: Subscription;

  public constructor(private duelsService: DuelsService,
                     public authService: AuthService,
                     private router: Router,
                     private titleService: Title,
                     private toastr: ToastsManager, ) {
    this.duelCreatedSubscription = duelsService.duelCreated$.subscribe(
      duel => this.pendingDuels.push(duel)
    );
    this.authenticatedSubscription = authService.authenticated$.subscribe(
      () => {
        this.loadDuelWeeks();
        this.loadPendingDuels();
      }
    );
  }

  ngOnInit(): void {
    this.titleService.setTitle('BuddyDuel');

    if (this.router.url.includes('access_token')) {
      this.authService.handleAuthentication()
      .catch(err => {
        console.error(err);
        this.toastr.error('An error occurred logging you in!');
      });
    } else {
      this.authService.checkSession();
    }
  }

  ngOnDestroy(): void {
    this.authenticatedSubscription.unsubscribe();
  }

  private loadDuelWeeks(): void {
    this.duelsService.getDuelWeeks({ current: true })
      .then(duelWeeks => this.currentDuelWeeks = duelWeeks)
      .catch(err => this.toastr.error(err));
  }

  private loadPendingDuels(): void {
    this.duelsService.getDuels({ status: 'pending' })
      .then(duels => this.pendingDuels = duels)
      .catch(err => this.toastr.error(err));
  }

  opponentName(duelWeek: DuelWeek): string {
    return this.duelsService.opponentForPlayers(duelWeek.players).name;
  }

  acceptDuel(): void {
    this.processingAccept = true;
    this.duelsService.acceptDuel(this.acceptCode)
    .then(() => {
      this.loadDuelWeeks();
      this.acceptCode = '';
      this.processingAccept = false;
      this.toastr.success('Duel accepted!')
    })
    .catch(err => {
      this.processingAccept = false;
      this.toastr.error(err);
    });
  }

  deleteDuel(duelId: string): void {
    this.duelsService.deleteDuel(duelId)
    .then(() => {
      this.pendingDuels = this.pendingDuels.filter(duel => duel._id !== duelId);
      this.toastr.success('Duel deleted')
    })
    .catch(err => this.toastr.error(err));
  }
}
