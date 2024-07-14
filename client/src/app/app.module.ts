import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthService } from './auth/auth.service';
import { DuelsModule } from './duels/duels.module';
import { DuelWeeksModule } from './duel-weeks/duel-weeks.module';
import { HomeComponent } from './home/home.component';
import { NavComponent } from './nav/nav.component';
import { SharedModule } from './shared/shared.module';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserProfileService } from './user-profile/user-profile.service';

export function getToken() {
  return localStorage.getItem('access_token');
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DuelsModule,
    DuelWeeksModule,
    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    SharedModule,
    AppRoutingModule,
  ],
  providers: [AuthService, UserProfileService],
  declarations: [
    AppComponent,
    HomeComponent,
    NavComponent,
    UserProfileComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
