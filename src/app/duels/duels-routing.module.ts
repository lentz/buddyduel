import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DuelComponent } from '../duels/duel.component';
import { DuelWeekComponent } from '../duels/duel-week.component';

const duelRoutes: Routes = [
  { path: 'duels/:id', component: DuelComponent },
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
