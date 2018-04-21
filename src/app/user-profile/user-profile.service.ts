import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class UserProfileService {
  private profileURL = 'api/profile';
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private authHttp: AuthHttp) { }

  getProfile(): Promise<any> {
    return this.authHttp.get(this.profileURL)
    .toPromise()
    .then(response => response.json())
    .catch(this.handleError);
  }

  updateProfile(profile: { reminderEmails: boolean }): Promise<any> {
    return this.authHttp.put(this.profileURL, profile, { headers: this.headers })
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    if (error.json) { error = error.json().message; }
    return Promise.reject(error.statusText || error);
  }
}
