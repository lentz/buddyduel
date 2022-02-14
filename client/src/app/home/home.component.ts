import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { Duel } from '../duels/duel';
import { DuelsService } from '../duels/duels.service';
import { DuelWeek } from '../duel-weeks/duel-week';
import { DuelWeeksService } from '../duel-weeks/duel-weeks.service';

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
  loadComplete = false;

  public constructor(
    private duelsService: DuelsService,
    private duelWeeksService: DuelWeeksService,
    public authService: AuthService,
    private router: Router,
    private titleService: Title,
    private toastr: ToastrService,
  ) {
    this.duelCreatedSubscription = duelsService.duelCreated$.subscribe((duel) =>
      this.pendingDuels.push(duel),
    );
    if (this.authService.isAuthenticated()) {
      this.loadDuelWeeks().then(() => {
        this.loadComplete = true;
      });
      this.loadPendingDuels();
    }
  }

  ngOnInit(): void {
    this.router.navigateByUrl('/');
    this.titleService.setTitle('BuddyDuel');
  }

  private async loadDuelWeeks(): Promise<any> {
    try {
      this.currentDuelWeeks = await this.duelWeeksService.getDuelWeeks({
        current: true,
      });
    } catch (err) {
      this.toastr.error((err as Error).toString());
    }
  }

  private loadPendingDuels(): void {
    this.duelsService
      .getDuels({ status: 'pending' })
      .then((duels) => (this.pendingDuels = duels))
      .catch((err) => this.toastr.error(err));
  }

  opponentName(duelWeek: DuelWeek): string {
    return this.duelsService.opponentForPlayers(duelWeek.players).name;
  }

  acceptDuel(): void {
    this.processingAccept = true;
    this.duelsService
      .acceptDuel(this.acceptCode)
      .then(() => {
        this.loadDuelWeeks();
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
    this.duelsService
      .deleteDuel(duelId)
      .then(() => {
        this.pendingDuels = this.pendingDuels.filter(
          (duel) => duel._id !== duelId,
        );
        this.toastr.success('Duel deleted');
      })
      .catch((err) => this.toastr.error(err));
  }
}
