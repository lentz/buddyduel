import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MatchupDetailComponent } from './matchup-detail.component';
import { MatchupsListComponent } from './matchups-list.component';

import { MatchupsRoutingModule } from './matchups-routing.module';

import { PointSpread } from './point-spread.pipe';

@NgModule({
  imports: [
    BrowserModule,
    MatchupsRoutingModule,
  ],
  declarations: [
    MatchupDetailComponent,
    MatchupsListComponent,
    PointSpread,
  ],
})
export class MatchupsModule { }
