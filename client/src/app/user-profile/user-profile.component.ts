import { Component, OnInit, inject } from '@angular/core';
import { NgClass, DecimalPipe, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { ToastrService } from 'ngx-toastr';

import { RecordPipe } from '../shared/record.pipe';
import { WinPercentagePipe } from '../shared/win-percentage.pipe';

import { UserProfileService } from './user-profile.service';

@Component({
  imports: [
    NgClass,
    FormsModule,
    DecimalPipe,
    CurrencyPipe,
    RecordPipe,
    WinPercentagePipe,
  ],
  providers: [UserProfileService],
  selector: 'app-user-profile',
  styleUrls: ['./user-profile.component.css'],
  templateUrl: './user-profile.component.html',
})
export class UserProfileComponent implements OnInit {
  private titleService = inject(Title);
  private toastr = inject(ToastrService);
  private userProfileService = inject(UserProfileService);

  record = { wins: 0, losses: 0, pushes: 0 };
  winnings = 0;
  reminderEmails!: boolean;

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
