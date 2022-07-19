import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface UserProfile {
  preferences: {
    reminderEmails: boolean;
  };
  record: {
    losses: number;
    pushes: number;
    wins: number;
  };
  winnings: number;
}

@Injectable()
export class UserProfileService {
  private profileURL = 'api/profile';
  private headers = { 'Content-Type': 'application/json' };

  constructor(private http: HttpClient) {}

  getProfile() {
    return this.http.get<UserProfile>(this.profileURL);
  }

  updateProfile(profile: { reminderEmails: boolean }) {
    return this.http.put<void>(this.profileURL, profile, {
      headers: this.headers,
    });
  }
}
