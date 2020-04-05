import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { DuelComponent } from './duel.component';
import { DuelsRoutingModule } from './duels-routing.module';
import { DuelsService } from './duels.service';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [BrowserModule, DuelsRoutingModule, SharedModule],
  declarations: [DuelComponent],
  providers: [DuelsService],
})
export class DuelsModule {}
