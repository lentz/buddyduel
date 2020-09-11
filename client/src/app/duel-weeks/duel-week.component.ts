import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

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
  duelWeek!: DuelWeek;
  Math: any;
  liveUpdateSubscription: Subscription | null;

  constructor(
    private duelsService: DuelsService,
    private duelWeeksService: DuelWeeksService,
    private route: ActivatedRoute,
    private titleService: Title,
    private toastr: ToastrService,
    private authService: AuthService,
  ) {
    this.Math = Math;
    this.liveUpdateSubscription = null;
  }

  ngOnInit(): void {
    this.loadDuelWeek();
  }

  ngOnDestroy(): void {
    if (this.liveUpdateSubscription) {
      this.liveUpdateSubscription.unsubscribe();
    }
  }

  private startLiveUpdate(): void {
    this.liveUpdateSubscription = timer(30000, 30000).subscribe(async () => {
      if (!this.duelWeek) {
        return;
      }
      const newDuelWeek = await this.duelWeeksService.getDuelWeek(
        this.duelWeek._id,
      );
      newDuelWeek.games = newDuelWeek.games.map((newGame) => {
        if (Game.hasStarted(newGame)) {
          return newGame;
        }
        return (
          this.duelWeek.games.find((game) => newGame.id === game.id) || newGame
        );
      });
      this.duelWeek = newDuelWeek;
    });
  }

  private loadDuelWeek(): void {
    this.route.paramMap.subscribe(async (params: ParamMap) => {
      try {
        this.duelWeek = await this.duelWeeksService.getDuelWeek(
          params.get('id') as string,
        );
        this.titleService.setTitle(
          `${this.duelWeek.sport} ${
            this.duelWeek.description
          } vs. ${this.opponentName()} | BuddyDuel`,
        );
        if (this.hasLiveGames()) {
          this.startLiveUpdate();
        }
      } catch (err) {
        this.toastr.error(err);
      }
    });
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

  hasLiveGames(): boolean {
    return this.duelWeek.games.some(this.isLiveGame);
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
