import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DuelWeekComponent } from './duel-week.component';

const duelWeeksRoutes: Routes = [
  { path: 'duel-weeks/:id', component: DuelWeekComponent },
];
@NgModule({
  imports: [RouterModule.forChild(duelWeeksRoutes)],
  exports: [RouterModule],
})
export class DuelWeeksRoutingModule {}
