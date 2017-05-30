import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { DuelsService } from '../duels/duels.service'
import { Duel } from '../duels/duel';

@Component({
  selector: 'app-root',
  providers: [DuelsService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  duels: Duel[];
  selectedDuelId: string;
  duelWeekIds: string[];

  public constructor(private titleService: Title,
                     private duelsService: DuelsService) { }

  ngOnInit(): void {
    // FIXME: Make this work
    this.titleService.setTitle('BuddyDuel');
    this.duelsService.getDuels()
    .then((duels) => {
      this.duels = duels;
      if (duels.length > 0) { this.selectedDuelId = duels[0]._id };
      this.updateDuelWeeks();
    })
  }

  onDuelSelect(event: any, duel: Duel): void {
    event.preventDefault();
    this.selectedDuelId = duel._id;
    this.updateDuelWeeks();
  }

  private updateDuelWeeks(): void {
    this.duelsService.getDuelWeekIds(this.selectedDuelId)
    .then(duelWeekIds => this.duelWeekIds = duelWeekIds);
  }
}
