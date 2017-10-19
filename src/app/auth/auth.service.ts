import auth0 from 'auth0-js';
import IdTokenVerifier from 'idtoken-verifier';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/observable/timer';
import 'rxjs/add/observable/of';

import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {
  auth0 = new auth0.WebAuth({
    clientID: 'sL6CB8EzVFHvPIG4XaF7JgLAf6R90QbE',
    domain: 'app68395404.auth0.com',
    responseType: 'token id_token',
    audience: 'http://www.buddyduel.net/api',
    redirectUri: environment.authCallbackURL,
    scope: 'openid profile email'
  });
  private refreshSubscription: any;

  constructor(public router: Router) {}

  login(): void {
    this.auth0.authorize();
  }

  handleAuthentication(): Promise<any> {
    this.logout();
    return new Promise((resolve, reject) => {
      this.auth0.parseHash((err, authResult) => {
        if (err) { return reject(err); }
        if (authResult && authResult.accessToken && authResult.idToken) {
          window.location.hash = '';
          this.setSession(authResult);
          this.router.navigate(['/']);
          resolve();
        }
      });
    });
  }

  getUserProfile(): any {
    return new IdTokenVerifier().decode(localStorage.getItem('id_token'))
                                .payload;
  }

  logout(event?: any): void {
    if (event) { event.preventDefault(); }
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    this.unscheduleRenewal();
    this.router.navigate(['/']);
  }

  checkSession(cb?: any): void {
    if (!cb) { cb = () => {}; }
    if (localStorage.hasOwnProperty('expires_at') && !this.isAuthenticated()) {
      return this.renewToken(cb);
    }
    return cb();
  }

  isAuthenticated(): boolean {
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

  renewToken(cb?: any) {
    if (!cb) { cb = () => {}; }
    this.auth0.renewAuth({
      audience: this.auth0.baseOptions.audience,
      redirectUri: environment.authSilentUri,
      usePostMessage: true,
    }, (err, authResult) => {
      if (err) {
        console.log('Error renewing token!', err);
        return cb(err);
      }
      this.setSession(authResult);
      return cb();
    });
  }

  scheduleRenewal() {
    if (!this.isAuthenticated()) { return; }
    this.unscheduleRenewal();

    const expiresAt = JSON.parse(window.localStorage.getItem('expires_at'));
    const source = Observable.of(expiresAt).flatMap(expireTime => {
      const now = Date.now();
      return Observable.timer(Math.max(1, expireTime - now));
    });

    this.refreshSubscription = source.subscribe(() => {
      this.renewToken();
      this.scheduleRenewal();
    });
  }

  unscheduleRenewal() {
    if (!this.refreshSubscription) { return; }
    this.refreshSubscription.unsubscribe();
  }

  private setSession(authResult): void {
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
    this.scheduleRenewal();
  }
}
