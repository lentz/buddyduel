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
  duels = [ { _id: '592ba2404ea587608ebdae4d' } ]; // TODO retrieve from service
  selectedDuelId: string;
  duelWeekIds: string[];

  public constructor(private titleService: Title,
                     private duelsService: DuelsService) { }

  ngOnInit(): void {
    // FIXME: Make this work
    this.titleService.setTitle('BuddyDuel');
    this.selectedDuelId = this.duels[0]._id;
    this.duelsService.getDuelWeekIds(this.selectedDuelId).then(duelWeekIds => {
      this.duelWeekIds = duelWeekIds;
    });
  }
}
