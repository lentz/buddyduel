import * as auth0 from 'auth0-js';
import * as IdTokenVerifier from 'idtoken-verifier';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, of, timer } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {
  private audience = 'https://www.buddyduel.net/api';
  webAuth = new auth0.WebAuth({
    clientID: 'sL6CB8EzVFHvPIG4XaF7JgLAf6R90QbE',
    domain: 'app68395404.auth0.com',
    responseType: 'token id_token',
    audience: this.audience,
    redirectUri: environment.authCallbackURL,
    scope: 'openid profile email',
  });
  private refreshSubscription: any;

  private authenticatedSource = new Subject<void>();
  authenticated$ = this.authenticatedSource.asObservable();

  constructor(public router: Router) {}

  login(): void {
    this.webAuth.authorize();
  }

  handleAuthentication(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.webAuth.parseHash((err: auth0.Auth0Error | null, authResult: auth0.Auth0DecodedHash) => {
        if (err) { return reject(err); }
        if (authResult && authResult.accessToken && authResult.idToken) {
          history.pushState(null, '', '/');
          this.setSession(authResult);
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
    this.clearSession();
    this.unscheduleRenewal();
    this.router.navigate(['/']);
  }

  checkSession(): void {
    if (this.isAuthenticated()) { return this.authenticatedSource.next(); }
    if (localStorage.hasOwnProperty('expires_at')) {
      return this.renewToken();
    }
    this.router.navigate(['/']);
  }

  isAuthenticated(): boolean {
    const expiresAt = JSON.parse(localStorage.getItem('expires_at') || 'null');
    return new Date().getTime() < expiresAt;
  }

  private renewToken(): void {
    this.webAuth.renewAuth({
      audience: this.audience,
      redirectUri: environment.authSilentUri,
      usePostMessage: true,
    }, (err: auth0.Auth0Error | null, authResult: any) => {
      if (err || authResult.error) {
        console.error(err || authResult);
        this.clearSession();
        return this.login();
      }
      this.setSession(authResult);
    });
  }

  // FIXME Refactor to actually work
  private scheduleRenewal() {
    if (!this.isAuthenticated()) { return; }
    this.unscheduleRenewal();

    const source = timer(1000 * 60 * 60); // 1 hour

    this.refreshSubscription = source.subscribe(() => {
      this.renewToken();
      this.scheduleRenewal();
    });
  }

  private unscheduleRenewal() {
    if (!this.refreshSubscription) { return; }
    this.refreshSubscription.unsubscribe();
  }

  private clearSession(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
  }

  private setSession(authResult: any): void {
    this.clearSession();
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
    this.authenticatedSource.next();
    this.scheduleRenewal();
  }
}
