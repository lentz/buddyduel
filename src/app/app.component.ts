import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { MatchupsService } from '../matchups/matchups.service'

@Component({
  selector: 'app-root',
  providers: [MatchupsService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public constructor(private titleService: Title,
                     private matchupsService: MatchupsService) { }
  matchupIds: string[];

  ngOnInit(): void {
    // FIXME: Make this work
    this.titleService.setTitle('BuddyDuel');
    this.matchupsService.getMatchupIds().then(matchupIds => {
      this.matchupIds = matchupIds;
    });
  }
}
