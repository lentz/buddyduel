import { Injectable } from '@angular/core';
import Cookies from 'js-cookie';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {
  private clientId = 'GSkOJccgw4k4qwHUuHu5oKEv8lWUHdF8';
  private auth0URL = 'https://buddyduel.us.auth0.com';

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

  getUser(): { id: string; name: string } {
    return {
      id: Cookies.get('userId') ?? 'unknown',
      name: Cookies.get('userName') ?? 'Guest',
    };
  }

  isAuthenticated(): boolean {
    return Cookies.get('userId') !== undefined;
  }
}
