import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserProfileService {
  private profileURL = 'api/profile';
  private headers = { 'Content-Type': 'application/json' };

  constructor(private http: HttpClient) { }

  getProfile(): Promise<any> {
    return this.http.get(this.profileURL)
    .toPromise()
    .then((response: any) => response)
    .catch(this.handleError);
  }

  updateProfile(profile: { reminderEmails: boolean }): Promise<any> {
    return this.http.put(this.profileURL, profile, { headers: this.headers })
      .toPromise()
      .then((response: any) => response)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    if (error.message) { error = error.message; }
    return Promise.reject(error.statusText || error);
  }
}
