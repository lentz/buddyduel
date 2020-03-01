import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DuelComponent } from './duel.component';

const duelsRoutes: Routes = [
  { path: 'duels/:id', component: DuelComponent },
];
@NgModule({
  imports: [
    RouterModule.forChild(duelsRoutes),
  ],
  exports: [
    RouterModule,
  ],
})
export class DuelsRoutingModule {}
