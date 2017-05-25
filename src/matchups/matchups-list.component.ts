import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Title } from '@angular/platform-browser';

import 'rxjs/add/operator/switchMap';

import { Matchup } from './matchup';
import { MatchupsService } from './matchups.service'

@Component({
  selector: 'matchups-list',
  providers: [MatchupsService],
  templateUrl: './matchups-list.component.html',
})
export class MatchupsListComponent implements OnInit {
  private week: number;
  title: string;
  matchups: Matchup[];

  constructor(private matchupsService: MatchupsService,
              private route: ActivatedRoute,
              private titleService: Title) { }

  ngOnInit(): void {
    this.route.params
      .switchMap((params: Params) => {
        this.week = +params['week'];
        this.title = `Week ${this.week} Matchups - BuddyDuel`;
        this.titleService.setTitle(this.title);
        return this.matchupsService.getWeek(this.week);
      })
      .subscribe(matchups => this.matchups = matchups);
  }

  save(): void {
    this.matchupsService.save(this.matchups);
  }
}
