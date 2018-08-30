import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service'
import { DuelWeek } from './duel-week';
import { DuelsService } from './duels.service';

@Component({
  selector: 'duel-summary',
  providers: [DuelsService],
  templateUrl: './duel.component.html',
  styleUrls: ['./duel.component.css'],
})
export class DuelComponent implements OnInit, OnDestroy {
  duelWeeks: DuelWeek[] = [];
  authenticatedSubscription!: Subscription;

  constructor(private duelsService: DuelsService,
              private route: ActivatedRoute,
              private titleService: Title,
              private toastr: ToastrService,
              private authService: AuthService, ) { }

  ngOnInit(): void {
    this.authenticatedSubscription = this.authService.authenticated$.subscribe(
      this.loadDuelWeeks.bind(this)
    );
    this.authService.checkSession();
  }

  ngOnDestroy(): void {
    this.authenticatedSubscription.unsubscribe();
  }

  years(): number[] {
    return Array.from(new Set(this.duelWeeks.map(duelWeek => duelWeek.year)));
  }

  duelWeeksFor(year: number): DuelWeek[] {
    return this.duelWeeks.filter(duelWeek => duelWeek.year === year);
  }

  userWinnings(year?: number): number {
    return this.aggregateWinnings(this.authService.getUserProfile().sub, year);
  }

  opponentWinnings(year?: number): number {
    if (!this.duelWeeks[0]) { return 0; }
    return this.aggregateWinnings(
      this.duelsService.opponentForPlayers(this.duelWeeks[0].players).id,
      year,
    );
  }

  userRecord(year?: number) {
    return this.aggregateRecord(this.authService.getUserProfile().sub, year);
  }

  opponentRecord(year?: number) {
    if (!this.duelWeeks[0]) { return { wins: 0, losses: 0, pushes: 0 }; }
    return this.aggregateRecord(
      this.duelsService.opponentForPlayers(this.duelWeeks[0].players).id,
      year,
    );
  }

  pickerName(duelWeek: DuelWeek): string {
    if (duelWeek.picker.id === this.authService.getUserProfile().sub) { return 'You'; }
    return duelWeek.picker.name;
  }

  opponentName(): string {
    if (this.duelWeeks.length < 1) { return ''; }
    return this.duelsService.opponentForPlayers(this.duelWeeks[0].players).name;
  }

  private aggregateWinnings(pickerId: string, year?: number) {
    return this.duelWeeks
      .filter(duelWeek => year ? duelWeek.year === year : true)
      .filter(duelWeek => duelWeek.picker.id === pickerId)
      .reduce((winnings, duelWeek) => winnings + duelWeek.winnings, 0);
  }

  private aggregateRecord(pickerId: string, year?: number) {
    return this.duelWeeks
      .filter(duelWeek => year ? duelWeek.year === year : true)
      .filter(duelWeek => duelWeek.picker.id === pickerId)
      .reduce((overallRecord, duelWeek) => {
        overallRecord.wins += duelWeek.record.wins;
        overallRecord.losses += duelWeek.record.losses;
        overallRecord.pushes += duelWeek.record.pushes;
        return overallRecord;
      }, { wins: 0, losses: 0, pushes: 0});
  }

  private loadDuelWeeks(): void {
    this.route.paramMap.subscribe(
      async (params: ParamMap) => {
        try {
          const duelWeeks = await this.duelsService.getDuelWeeks({ duelId: params.get('id') });
          this.duelWeeks = duelWeeks;
          this.titleService.setTitle(
            `vs. ${this.duelsService.opponentForPlayers(duelWeeks[0].players).name} | BuddyDuel`
          );
          this.authenticatedSubscription.unsubscribe();
        } catch (err) {
          this.toastr.error(err);
        }
      },
    );
  }
}
