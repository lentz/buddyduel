import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { EventSourcePolyfill } from 'ng-event-source';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service'
import { DuelWeek } from './duel-week';
import { Game } from './game';
import { DuelsService } from './duels.service';

@Component({
  selector: 'duel-week',
  providers: [DuelsService],
  templateUrl: './duel-week.component.html',
  styleUrls: ['./duel-week.component.css'],
})
export class DuelWeekComponent implements OnInit, OnDestroy {
  duelWeek!: DuelWeek;
  Math: any;
  authenticatedSubscription!: Subscription;
  private livescoresES: EventSourcePolyfill | undefined;

  constructor(private duelsService: DuelsService,
              private route: ActivatedRoute,
              private titleService: Title,
              private toastr: ToastrService,
              private authService: AuthService, ) {
    this.Math = Math;
  }

  ngOnInit(): void {
    this.authenticatedSubscription = this.authService.authenticated$.subscribe(
      this.loadDuelWeek.bind(this)
    );
    this.authService.checkSession();
  }

  ngOnDestroy(): void {
    this.authenticatedSubscription.unsubscribe();
    if (this.livescoresES) { this.livescoresES.close(); }
  }

  private loadDuelWeek(): void {
    this.route.paramMap.subscribe(
      async (params: ParamMap) => {
        try {
          const duelWeek = await this.duelsService.getWeek(params.get('id') as string);
          this.duelWeek = duelWeek;
          this.titleService.setTitle(`Week ${duelWeek.weekNum} vs. ${this.opponentName()} | BuddyDuel`);
          if (this.hasLiveGames()) {
            this.livescoresES = this.duelsService.livescoresES(duelWeek._id);
            this.livescoresES.onmessage = (event: { data: string }) => {
              this.duelWeek = JSON.parse(event.data);
            };
          }
        } catch (err) {
          this.toastr.error(err);
        }
      },
    );
  }

  save(): void {
    this.duelsService.save(this.duelWeek)
    .then(() => {
      this.toastr.success('Picks locked in!');
      this.duelWeek.games.forEach(game => game.updated = false);
    })
    .catch(err => this.toastr.error('Failed to save picks'));
  }

  hasLiveGames(): boolean {
    return this.duelWeek.games.some(game => {
      return game.time !== undefined && game.time !== 'Final';
    });
  }

  canModifyPicks(): boolean {
    return this.isPicker() &&
           this.duelWeek.games.some(game => {
             return (!game.selectedTeam && game.startTime > +new Date()) || game.updated
           });
  }

  isPicker(): boolean {
    return this.duelWeek.picker.id === this.authService.getUserProfile().sub
  }

  pickedBy(): string {
    return this.isPicker() ? 'You' : this.duelWeek.picker.name;
  }

  opponentName(): string {
    return this.duelsService.opponentForPlayers(this.duelWeek.players).name;
  }

  isWinner(): boolean {
    if (this.duelWeek.winnings === 0) { return true; }
    return (this.isPicker() && this.duelWeek.winnings > 0) ||
           (!this.isPicker() && this.duelWeek.winnings < 0)
  }

  hasResults(): boolean {
    const record = this.duelWeek.record;
    return (record.wins + record.losses + record.pushes) > 0;
  }
}
