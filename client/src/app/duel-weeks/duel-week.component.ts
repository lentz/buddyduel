import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { DuelWeek } from './duel-week';
import { Game } from './game';
import { DuelsService } from '../duels/duels.service';
import { DuelWeeksService } from './duel-weeks.service';
import { NgIf, NgClass, NgFor, AsyncPipe, CurrencyPipe } from '@angular/common';
import { GameComponent } from './game.component';
import { RecordPipe } from '../shared/record.pipe';

@Component({
  selector: 'duel-week',
  providers: [AuthService, DuelsService, DuelWeeksService],
  templateUrl: './duel-week.component.html',
  styleUrls: ['./duel-week.component.css'],
  imports: [
    NgIf,
    NgClass,
    NgFor,
    GameComponent,
    AsyncPipe,
    CurrencyPipe,
    RecordPipe,
  ],
})
export class DuelWeekComponent implements OnInit {
  duelWeek$?: Observable<DuelWeek>;
  loading = true;
  math = Math;

  constructor(
    private duelsService: DuelsService,
    private duelWeeksService: DuelWeeksService,
    private route: ActivatedRoute,
    private titleService: Title,
    private toastr: ToastrService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.duelWeek$ = this.duelWeeksService
        .getDuelWeek(params.get('id') as string)
        .pipe(
          tap((duelWeek) => {
            this.loading = false;
            this.titleService.setTitle(
              `${duelWeek.sport} ${
                duelWeek.description
              } vs. ${this.opponentName(duelWeek)} | BuddyDuel`,
            );
          }),
          catchError((err) => {
            this.toastr.error(err.error?.message ?? err.statusText);
            return of();
          }),
        );
    });
  }

  save(duelWeek: DuelWeek) {
    this.duelWeeksService.updateDuelWeek(duelWeek).subscribe({
      next: () => {
        this.toastr.success('Picks locked in!');
        duelWeek.games.forEach((game) => (game.updated = false));
      },
      error: () => this.toastr.error('Failed to save picks'),
    });
  }

  canModifyPicks(duelWeek: DuelWeek): boolean {
    return (
      this.isPicker(duelWeek) &&
      duelWeek.games.some((game) => {
        return (!game.selectedTeam && !Game.hasStarted(game)) || game.updated;
      })
    );
  }

  isPicker(duelWeek: DuelWeek): boolean {
    return duelWeek.picker.id === this.authService.getUser().id;
  }

  pickedBy(duelWeek: DuelWeek): string {
    return this.isPicker(duelWeek) ? 'You' : duelWeek.picker.name;
  }

  opponentName(duelWeek: DuelWeek): string {
    return this.duelsService.opponentForPlayers(duelWeek.players).name;
  }

  isWinner(duelWeek: DuelWeek): boolean {
    if (duelWeek.winnings === 0) {
      return true;
    }
    return (
      (this.isPicker(duelWeek) && duelWeek.winnings > 0) ||
      (!this.isPicker(duelWeek) && duelWeek.winnings < 0)
    );
  }

  hasResults(duelWeek: DuelWeek): boolean {
    const record = duelWeek.record;
    return record.wins + record.losses + record.pushes > 0;
  }
}
