import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';

import { UserProfileService } from './user-profile.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  record = { wins: 0, losses: 0, pushes: 0 };
  winnings = 0;
  reminderEmails!: boolean;

  constructor(
    private titleService: Title,
    private toastr: ToastrService,
    private userProfileService: UserProfileService,
  ) {}

  ngOnInit() {
    this.titleService.setTitle('My Profile | BuddyDuel');
    this.userProfileService.getProfile().subscribe(
      (profile) => {
        this.record = profile.record;
        this.reminderEmails = profile.preferences.reminderEmails;
        this.winnings = profile.winnings;
      },
      () => {
        this.toastr.error('Failed to load user profile');
      },
    );
  }

  savePreferences() {
    this.userProfileService
      .updateProfile({ reminderEmails: this.reminderEmails })
      .subscribe(
        () => this.toastr.success('Preferences saved'),
        () => this.toastr.error('Failed to save preferences'),
      );
  }
}
