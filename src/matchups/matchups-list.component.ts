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
  id: string;
  matchups = new Array<Matchup>();

  constructor(private matchupsService: MatchupsService,
              private route: ActivatedRoute,
              private titleService: Title) { }

  ngOnInit(): void {
    this.route.params
      .switchMap((params: Params) => {
        this.title = `Week X vs Player - BuddyDuel`;
        this.titleService.setTitle(this.title);
        return this.matchupsService.getWeek(params['id']);
      })
      .subscribe(matchupWeek => {
        this.matchups = matchupWeek.picks;
        this.id = matchupWeek._id;
      });
  }

  save(): void {
    this.matchupsService.save(this.matchups);
  }
}
