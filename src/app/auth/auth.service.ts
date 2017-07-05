import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import auth0 from 'auth0-js';
import IdTokenVerifier from 'idtoken-verifier';

import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {
  auth0 = new auth0.WebAuth({
    clientID: 'Ur0fX3b97A3iybl7g20RwsR4u9uWMWQu',
    domain: 'app68395404.auth0.com',
    responseType: 'token id_token',
    audience: 'http://www.buddyduel.net/api',
    redirectUri: environment.authCallbackURL,
    scope: 'openid profile email'
  });

  constructor(public router: Router) {}

  login(): void {
    this.auth0.authorize();
  }

  handleAuthentication(): Promise<any> {
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

    this.router.navigate(['/']);
  }

  isAuthenticated(): boolean {
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

  private setSession(authResult): void {
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }
}
