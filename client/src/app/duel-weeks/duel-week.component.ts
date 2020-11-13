import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription, timer } from 'rxjs';
import { distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { DuelWeek } from './duel-week';
import { Game } from './game';
import { DuelsService } from '../duels/duels.service';
import { DuelWeeksService } from './duel-weeks.service';

@Component({
  selector: 'duel-week',
  providers: [DuelWeeksService],
  templateUrl: './duel-week.component.html',
  styleUrls: ['./duel-week.component.css'],
})
export class DuelWeekComponent implements OnInit, OnDestroy {
  duelWeek = new DuelWeek({});
  Math: any;
  updateSubscription$: Subscription | null = null;
  noLiveGamesSubject = new Subject();

  constructor(
    private duelsService: DuelsService,
    private duelWeeksService: DuelWeeksService,
    private route: ActivatedRoute,
    private titleService: Title,
    private toastr: ToastrService,
    private authService: AuthService,
  ) {
    this.Math = Math;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.updateSubscription$ = timer(0, 30000)
        .pipe(
          switchMap(() =>
            this.duelWeeksService.getDuelWeek(params.get('id') as string),
          ),
          takeUntil(this.noLiveGamesSubject),
          distinctUntilChanged(
            (
              prevRes: HttpResponse<DuelWeek>,
              currRes: HttpResponse<DuelWeek>,
            ) => {
              return (
                prevRes.headers.get('etag') === currRes.headers.get('etag')
              );
            },
          ),
        )
        .subscribe(
          (res: HttpResponse<DuelWeek>) => {
            this.duelWeek = res.body ?? new DuelWeek({});
            if (!this.hasLiveGames()) {
              this.noLiveGamesSubject.next();
            }
            this.titleService.setTitle(
              `${this.duelWeek.sport} ${
                this.duelWeek.description
              } vs. ${this.opponentName()} | BuddyDuel`,
            );
          },
          (err) => {
            this.toastr.error(err.error?.message ?? err.statusText);
          },
        );
    });
  }

  ngOnDestroy(): void {
    this.updateSubscription$?.unsubscribe();
  }

  save(): void {
    this.duelWeeksService
      .updateDuelWeek(this.duelWeek)
      .then(() => {
        this.toastr.success('Picks locked in!');
        this.duelWeek.games.forEach((game) => (game.updated = false));
      })
      .catch((err) => this.toastr.error('Failed to save picks'));
  }

  hasLiveGames() {
    return this.duelWeek?.games.some(this.isLiveGame);
  }

  isLiveGame(game: Game): boolean {
    return game.time !== undefined && !/Final/i.test(game.time);
  }

  canModifyPicks(): boolean {
    return (
      this.isPicker() &&
      this.duelWeek.games.some((game) => {
        return (!game.selectedTeam && !Game.hasStarted(game)) || game.updated;
      })
    );
  }

  isPicker(): boolean {
    return this.duelWeek.picker.id === this.authService.getUser().id;
  }

  pickedBy(): string {
    return this.isPicker() ? 'You' : this.duelWeek.picker.name;
  }

  opponentName(): string {
    return this.duelsService.opponentForPlayers(this.duelWeek.players).name;
  }

  isWinner(): boolean {
    if (this.duelWeek.winnings === 0) {
      return true;
    }
    return (
      (this.isPicker() && this.duelWeek.winnings > 0) ||
      (!this.isPicker() && this.duelWeek.winnings < 0)
    );
  }

  hasResults(): boolean {
    const record = this.duelWeek.record;
    return record.wins + record.losses + record.pushes > 0;
  }
}
