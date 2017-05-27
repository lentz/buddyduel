import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { DuelsService } from '../duels/duels.service'

@Component({
  selector: 'app-root',
  providers: [DuelsService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  duelIds: string[];

  public constructor(private titleService: Title,
                     private duelsService: DuelsService) { }

  ngOnInit(): void {
    // FIXME: Make this work
    this.titleService.setTitle('BuddyDuel');
    this.duelsService.getDuelIds().then(duelIds => {
      this.duelIds = duelIds;
    });
  }
}
