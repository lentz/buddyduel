import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { GameComponent } from './game.component';
import { DuelWeekComponent } from './duel-week.component';
import { DuelsRoutingModule } from './duels-routing.module';
import { DuelsService } from './duels.service';
import { PointSpread } from './point-spread.pipe';

@NgModule({
  imports: [
    BrowserModule,
    DuelsRoutingModule,
  ],
  declarations: [
    GameComponent,
    DuelWeekComponent,
    PointSpread,
  ],
  providers: [
    DuelsService,
  ],
})
export class DuelsModule { }
