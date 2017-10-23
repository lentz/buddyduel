import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Subscription } from 'rxjs/Subscription';

import 'rxjs/add/operator/switchMap';

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
  authenticatedSubscription: Subscription;

  constructor(private duelsService: DuelsService,
              private route: ActivatedRoute,
              private titleService: Title,
              private toastr: ToastsManager,
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

  pickerName(duelWeek: DuelWeek): string {
    if (duelWeek.picker.id === this.authService.getUserProfile().sub) { return 'You'; }
    return duelWeek.picker.name;
  }

  opponentName(): string {
    if (this.duelWeeks.length < 1) { return ''; }
    return this.duelsService.opponentForPlayers(this.duelWeeks[0].players);
  }

  private loadDuelWeeks(): void {
    this.route.params
      .switchMap((params: Params) => this.duelsService.getDuelWeeks({ duelId: params['id'] }))
      .subscribe(duelWeeks => {
        this.duelWeeks = duelWeeks;
        this.titleService.setTitle(
          `BuddyDuel - ${this.duelsService.opponentForPlayers(duelWeeks[0].players)}`
        );
      }, err => this.toastr.error(err));
  }
}
