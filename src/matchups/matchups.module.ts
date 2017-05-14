import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MatchupDetailComponent } from './matchup-detail.component';
import { MatchupsListComponent } from './matchups-list.component';
import { PointSpread } from './point-spread.pipe';

@NgModule({
  declarations: [
    MatchupsListComponent,
    MatchupDetailComponent,
    PointSpread,
  ],
  exports: [
    MatchupsListComponent,
  ],
  imports: [
    BrowserModule,
  ],
})
export class MatchupsModule { }
