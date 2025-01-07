import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from '../auth/auth.service';
import { Duel } from './duel';
import { DuelWeek } from '../duel-weeks/duel-week';
import { DuelsService } from './duels.service';
import { DuelWeeksService } from '../duel-weeks/duel-weeks.service';
import { forkJoin } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

@Component({
    selector: 'duel-summary',
    providers: [DuelsService, DuelWeeksService],
    templateUrl: './duel.component.html',
    styleUrls: ['./duel.component.css'],
    standalone: false
})
export class DuelComponent implements OnInit {
  duel: Duel = new Duel('', '', '', 0, [], '');
  duelWeeks: DuelWeek[] = [];

  constructor(
    private duelsService: DuelsService,
    private duelWeeksService: DuelWeeksService,
    private route: ActivatedRoute,
    private titleService: Title,
    private toastr: ToastrService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((params: ParamMap) => params.get('id')),
        filter(
          (duelId): duelId is string => duelId !== null && duelId !== undefined,
        ),
        switchMap((duelId) => {
          return forkJoin({
            duel: this.duelsService.getDuel(duelId),
            duelWeeks: this.duelWeeksService.getDuelWeeks({ duelId }),
          });
        }),
      )
      .subscribe(
        (val) => {
          this.duelWeeks = val.duelWeeks;
          this.duel = val.duel;
          this.titleService.setTitle(
            `${this.duel.sport} vs. ${
              this.duelsService.opponentForPlayers(this.duelWeeks[0].players)
                .name
            } | BuddyDuel`,
          );
        },
        (err) => this.toastr.error((err as Error).toString()),
      );
  }

  years(): number[] {
    return Array.from(new Set(this.duelWeeks.map((duelWeek) => duelWeek.year)));
  }

  duelWeeksFor(year: number): DuelWeek[] {
    return this.duelWeeks.filter((duelWeek) => duelWeek.year === year);
  }

  userWinnings(year?: number): number {
    return this.aggregateWinnings(this.authService.getUser().id, year);
  }

  opponentWinnings(year?: number): number {
    if (!this.duelWeeks[0]) {
      return 0;
    }
    return this.aggregateWinnings(
      this.duelsService.opponentForPlayers(this.duelWeeks[0].players).id,
      year,
    );
  }

  userRecord(year?: number) {
    return this.aggregateRecord(this.authService.getUser().id, year);
  }

  opponentRecord(year?: number) {
    if (!this.duelWeeks[0]) {
      return { wins: 0, losses: 0, pushes: 0 };
    }
    return this.aggregateRecord(
      this.duelsService.opponentForPlayers(this.duelWeeks[0].players).id,
      year,
    );
  }

  pickerName(duelWeek: DuelWeek): string {
    if (duelWeek.picker.id === this.authService.getUser().id) {
      return 'You';
    }
    return duelWeek.picker.name;
  }

  opponentName(): string {
    if (this.duelWeeks.length < 1) {
      return '';
    }
    return this.duelsService.opponentForPlayers(this.duelWeeks[0].players).name;
  }

  isActive(): boolean {
    return this.duel && this.duel.status === 'active';
  }

  async toggleStatus(): Promise<void> {
    try {
      this.duel.status = this.isActive() ? 'suspended' : 'active';
      await this.duelsService.updateDuel(this.duel);
      this.toastr.success('Duel updated');
    } catch (err) {
      this.toastr.error((err as Error).toString());
    }
  }

  private aggregateWinnings(pickerId: string, year?: number) {
    return this.duelWeeks
      .filter((duelWeek) => (year ? duelWeek.year === year : true))
      .filter((duelWeek) => duelWeek.picker.id === pickerId)
      .reduce((winnings, duelWeek) => winnings + duelWeek.winnings, 0);
  }

  private aggregateRecord(pickerId: string, year?: number) {
    return this.duelWeeks
      .filter((duelWeek) => (year ? duelWeek.year === year : true))
      .filter((duelWeek) => duelWeek.picker.id === pickerId)
      .reduce(
        (overallRecord, duelWeek) => {
          overallRecord.wins += duelWeek.record.wins;
          overallRecord.losses += duelWeek.record.losses;
          overallRecord.pushes += duelWeek.record.pushes;
          return overallRecord;
        },
        { wins: 0, losses: 0, pushes: 0 },
      );
  }
}
