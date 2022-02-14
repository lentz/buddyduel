import { Injectable } from '@angular/core';
import Cookies from 'js-cookie';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {
  private clientId = 'FXEEzHOoJg84RpjeHMyxgocPpPMJt0yc';
  private auth0URL = 'https://app68395404.auth0.com';

  loginURL = encodeURI(
    `${this.auth0URL}/authorize` +
      '?response_type=code' +
      `&client_id=${this.clientId}` +
      '&scope=openid profile' +
      `&redirect_uri=${environment.baseURL}/auth/callback`,
  );
  logoutURL = encodeURI(
    `${this.auth0URL}/v2/logout` +
      `?client_id=${this.clientId}` +
      `&returnTo=${environment.baseURL}/logout`,
  );

  constructor() {}

  getUser(): { id: string; name: string } {
    return {
      id: Cookies.get('userId') || 'unknown',
      name: Cookies.get('userName') || 'Guest',
    };
  }

  isAuthenticated(): boolean {
    return Cookies.get('userId') !== undefined;
  }
}
