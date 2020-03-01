import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { GameComponent } from './game.component';
import { DuelComponent } from './duel.component';
import { DuelWeekComponent } from './duel-week.component';
import { DuelsRoutingModule } from './duels-routing.module';
import { DuelsService } from './duels.service';
import { PointSpread } from './point-spread.pipe';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    BrowserModule,
    DuelsRoutingModule,
    SharedModule,
  ],
  declarations: [
    GameComponent,
    DuelComponent,
    DuelWeekComponent,
    PointSpread,
  ],
  providers: [
    DuelsService,
  ],
})
export class DuelsModule { }
