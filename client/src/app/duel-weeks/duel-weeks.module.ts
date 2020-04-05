import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { GameComponent } from './game.component';
import { DuelWeekComponent } from './duel-week.component';
import { DuelWeeksRoutingModule } from './duel-weeks-routing.module';
import { DuelWeeksService } from './duel-weeks.service';
import { PointSpread } from './point-spread.pipe';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [BrowserModule, DuelWeeksRoutingModule, SharedModule],
  declarations: [GameComponent, DuelWeekComponent, PointSpread],
  providers: [DuelWeeksService],
})
export class DuelWeeksModule {}
