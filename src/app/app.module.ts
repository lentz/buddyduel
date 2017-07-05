import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { Http, HttpModule, RequestOptions } from '@angular/http';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'ng2-toastr/ng2-toastr';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthService } from './auth/auth.service';
import { DuelsModule } from './duels/duels.module';
import { HomeComponent } from './home/home.component';
import { NavComponent } from './nav/nav.component';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    tokenGetter: (() => localStorage.getItem('access_token'))
  }), http, options);
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DuelsModule,
    FormsModule,
    HttpModule,
    ToastModule.forRoot(),
    AppRoutingModule,
  ],
  providers: [
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions],
    },
    AuthService,
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    NavComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
