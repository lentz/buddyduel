import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Subscription, timer } from 'rxjs';
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
  liveUpdateSubscription: Subscription | null;

  constructor(private duelsService: DuelsService,
              private route: ActivatedRoute,
              private titleService: Title,
              private toastr: ToastrService,
              private authService: AuthService, ) {
    this.Math = Math;
    this.liveUpdateSubscription = null;
  }

  ngOnInit(): void {
    this.authenticatedSubscription = this.authService.authenticated$.subscribe(
      this.loadDuelWeek.bind(this)
    );
    this.authService.checkSession();
  }

  ngOnDestroy(): void {
    this.authenticatedSubscription.unsubscribe();
    if (this.liveUpdateSubscription) { this.liveUpdateSubscription.unsubscribe(); }
  }

  private startLiveUpdate(): void {
    this.liveUpdateSubscription = timer(0, 30000).subscribe(async () => {
      if (!this.duelWeek) { return; }
      const liveWeek = await this.duelsService.getWeek(this.duelWeek._id);
      liveWeek.games = this.duelWeek.games.map(game => {
        if (this.isLiveGame(game)) {
          return liveWeek.games.find(liveGame => game.id === liveGame.id) || game;
        }
        return game;
      });
      this.duelWeek = liveWeek;
    });
  }

  private loadDuelWeek(): void {
    this.route.paramMap.subscribe(
      async (params: ParamMap) => {
        try {
          this.duelWeek = await this.duelsService.getWeek(params.get('id') as string);
          this.titleService.setTitle(`Week ${this.duelWeek.weekNum} vs. ${this.opponentName()} | BuddyDuel`);
          if (this.hasLiveGames()) { this.startLiveUpdate(); }
          this.authenticatedSubscription.unsubscribe();
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
    return this.duelWeek.games.some(this.isLiveGame);
  }

  isLiveGame(game: Game): boolean {
    return game.time !== undefined && game.time !== 'Final';
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
