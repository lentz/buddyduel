import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DuelWeekComponent } from '../duels/duel-week.component';

const duelRoutes: Routes = [
  { path: 'duel-weeks/:id', component: DuelWeekComponent },
];
@NgModule({
  imports: [
    RouterModule.forChild(duelRoutes),
  ],
  exports: [
    RouterModule,
  ],
})
export class DuelsRoutingModule {}
