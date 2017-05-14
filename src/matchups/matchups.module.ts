import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MatchupsComponent } from './matchups.component';
import { PointSpread } from './point-spread.pipe';

@NgModule({
  declarations: [
    MatchupsComponent,
    PointSpread,
  ],
  exports: [
    MatchupsComponent,
  ],
  imports: [
    BrowserModule,
  ],
})
export class MatchupsModule { }
