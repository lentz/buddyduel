import { Injectable, inject } from '@angular/core';
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
  private http = inject(HttpClient);

  private profileURL = 'api/profile';
  private headers = { 'Content-Type': 'application/json' };

  getProfile() {
    return this.http.get<UserProfile>(this.profileURL);
  }

  updateProfile(profile: { reminderEmails: boolean }) {
    return this.http.put<void>(this.profileURL, profile, {
      headers: this.headers,
    });
  }
}
