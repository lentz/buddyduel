import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { GameComponent } from './game.component';
import { DuelComponent } from './duel.component';
import { DuelWeekComponent } from './duel-week.component';
import { DuelsRoutingModule } from './duels-routing.module';
import { DuelsService } from './duels.service';
import { PointSpread } from './point-spread.pipe';
import { Record } from './record.pipe';

@NgModule({
  imports: [
    BrowserModule,
    DuelsRoutingModule,
  ],
  declarations: [
    GameComponent,
    DuelComponent,
    DuelWeekComponent,
    PointSpread,
    Record,
  ],
  providers: [
    DuelsService,
  ],
})
export class DuelsModule { }
