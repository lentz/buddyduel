import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Title } from '@angular/platform-browser';

import 'rxjs/add/operator/switchMap';

import { DuelWeek } from './duel-week';
import { Game } from './game';
import { DuelsService } from './duels.service';

@Component({
  selector: 'duel-week',
  providers: [DuelsService],
  templateUrl: './duel-week.component.html',
})
export class DuelWeekComponent implements OnInit {
  private week: number;
  title: string;
  duelWeek = new DuelWeek(null, null, new Array<Game>());

  constructor(private duelsService: DuelsService,
              private route: ActivatedRoute,
              private titleService: Title) { }

  ngOnInit(): void {
    this.route.params
      .switchMap((params: Params) => {
        this.title = `BuddyDuel`;
        this.titleService.setTitle(this.title);
        return this.duelsService.getWeek(params['id']);
      })
      .subscribe(duelWeek => {
        this.duelWeek = duelWeek;
      });
  }

  save(): void {
    this.duelsService.save(this.duelWeek);
  }
}
