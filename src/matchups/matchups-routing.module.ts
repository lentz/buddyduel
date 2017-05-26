import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MatchupsListComponent } from '../matchups/matchups-list.component';

const matchupsRoutes: Routes = [
  { path: 'matchups/:id', component: MatchupsListComponent },
];
@NgModule({
  imports: [
    RouterModule.forChild(matchupsRoutes),
  ],
  exports: [
    RouterModule,
  ],
})
export class MatchupsRoutingModule {}
