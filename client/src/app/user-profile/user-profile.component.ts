import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service'
import { UserProfileService } from './user-profile.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  record = { wins: 0, losses: 0, pushes: 0 };
  winnings = 0;
  reminderEmails!: boolean;

  constructor(private titleService: Title,
              private toastr: ToastrService,
              private authService: AuthService,
              private userProfileService: UserProfileService, ) { }

  ngOnInit(): void {
    this.titleService.setTitle('My Profile | BuddyDuel');
    this.loadProfile();
  }

  savePreferences(): void {
    this.userProfileService.updateProfile({ reminderEmails: this.reminderEmails })
      .then(() => this.toastr.success('Preferences saved'))
      .catch(err => {
        console.error(err);
        this.toastr.error('Failed to save preferences');
      });
  }

  private loadProfile(): void {
    this.userProfileService.getProfile()
      .then(profile => {
        this.record = profile.record;
        this.winnings = profile.winnings;
        this.reminderEmails = profile.preferences.reminderEmails;
      })
      .catch(err => {
        console.error(err);
        this.toastr.error('Failed to load user profile');
      });
  }
}
