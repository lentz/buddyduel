import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import 'rxjs/add/operator/switchMap';

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
export class DuelWeekComponent implements OnInit {
  duelWeek: DuelWeek;

  constructor(private duelsService: DuelsService,
              private route: ActivatedRoute,
              private titleService: Title,
              private toastr: ToastsManager,
              private authService: AuthService, ) {
  }

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      return this.authService.logout();
    }
    this.route.params
      .switchMap((params: Params) => this.duelsService.getWeek(params['id']))
      .subscribe(duelWeek => {
        this.duelWeek = duelWeek;
        this.duelWeek.games.sort((a: any, b: any) => a.startTime - b.startTime);
        this.titleService.setTitle(`BuddyDuel - Week ${duelWeek.weekNum}`);
      });
  }

  save(): void {
    this.duelsService.save(this.duelWeek)
    .then(() => {
      this.toastr.success('Picks locked in!');
      this.duelWeek.games.forEach(game => game.updated = false);
    })
    .catch(err => this.toastr.error('Failed to save picks'));
  }

  canModifyPicks(): boolean {
    return this.isPicker() &&
      this.duelWeek.games.some(game => !game.selectedTeam || game.updated);
  }

  isPicker(): boolean {
    return this.duelWeek.picker.id === this.authService.getUserProfile().sub
  }

  opponentName(): string {
    return this.duelsService.opponentForPlayers(this.duelWeek.players);
  }
}
