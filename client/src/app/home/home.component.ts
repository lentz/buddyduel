import { AsyncPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { Duel } from '../duels/duel';
import { DuelsService } from '../duels/duels.service';
import { DuelWeek } from '../duel-weeks/duel-week';
import { DuelWeeksService } from '../duel-weeks/duel-weeks.service';

@Component({
  imports: [RouterLink, FormsModule, AsyncPipe],
  providers: [AuthService, DuelsService, DuelWeeksService],
  selector: 'app-home',
  styleUrls: ['./home.component.css'],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  private duelsService = inject(DuelsService);
  private duelWeeksService = inject(DuelWeeksService);
  authService = inject(AuthService);
  private router = inject(Router);
  private titleService = inject(Title);
  private toastr = inject(ToastrService);

  acceptCode = '';
  processingAccept = false;
  refreshDuelWeeks$ = new BehaviorSubject<boolean>(true);
  currentDuelWeeks$!: Observable<DuelWeek[]>;
  refreshPendingDuels$ = new BehaviorSubject<boolean>(true);
  pendingDuels$!: Observable<Duel[]>;
  duelCreatedSubscription: Subscription;

  public constructor() {
    const duelsService = this.duelsService;

    this.duelCreatedSubscription = duelsService.duelCreated$.subscribe(() =>
      this.refreshPendingDuels$.next(true),
    );
    if (this.authService.isAuthenticated()) {
      this.currentDuelWeeks$ = this.refreshDuelWeeks$.pipe(
        switchMap(() => this.duelWeeksService.getDuelWeeks({ current: true })),
      );
      this.pendingDuels$ = this.refreshPendingDuels$.pipe(
        switchMap(() => this.duelsService.getDuels({ status: 'pending' })),
      );
    }
  }

  ngOnInit(): void {
    this.router.navigateByUrl('/');
    this.titleService.setTitle('BuddyDuel');
  }

  opponentName(duelWeek: DuelWeek): string {
    return this.duelsService.opponentForPlayers(duelWeek.players).name;
  }

  acceptDuel(): void {
    this.processingAccept = true;
    this.duelsService
      .acceptDuel(this.acceptCode)
      .then(() => {
        this.refreshDuelWeeks$.next(true);
        this.acceptCode = '';
        this.processingAccept = false;
        this.toastr.success('Duel accepted!');
      })
      .catch((err) => {
        this.processingAccept = false;
        this.toastr.error(err);
      });
  }

  deleteDuel(duelId: string): void {
    this.duelsService.deleteDuel(duelId).subscribe({
      next: () => {
        this.refreshPendingDuels$.next(true);
        this.toastr.success('Duel deleted');
      },
      error: (err: HttpErrorResponse) => this.toastr.error(err.error.message),
    });
  }
}
