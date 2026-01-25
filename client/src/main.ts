import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  enableProdMode,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, Routes } from '@angular/router';

import { provideToastr } from 'ngx-toastr';

import { AppComponent } from 'app/app.component';
import { DuelComponent } from 'app/duels/duel.component';
import { DuelWeekComponent } from 'app/duel-weeks/duel-week.component';
import { HomeComponent } from 'app/home/home.component';
import { UserProfileComponent } from 'app/user-profile/user-profile.component';
import { environment } from 'environments/environment';

if (environment.production) {
  enableProdMode();
}

const routes: Routes = [
  { path: 'duels/:id', component: DuelComponent },
  { path: 'duel-weeks/:id', component: DuelWeekComponent },
  { path: 'profile', component: UserProfileComponent },
  { path: '**', component: HomeComponent },
];

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),
    importProvidersFrom(BrowserModule, FormsModule),
    provideToastr(),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    provideRouter(routes),
  ],
}).catch((err) => console.error(err));
