import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { AuthService } from '../auth/auth.service';
import { DuelsService } from '../duels/duels.service';
import { Duel } from '../duels/duel';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  acceptCode = '';

  public constructor(public duelsService: DuelsService,
                     public authService: AuthService,
                     private titleService: Title,
                     private toastr: ToastsManager, ) { }

  ngOnInit(): void {
    this.titleService.setTitle('BuddyDuel');
  }

  acceptDuel(): void {
    this.duelsService.acceptDuel(this.acceptCode)
    .then(() => {
      this.acceptCode = '';
      this.toastr.success('Duel accepted!')
    })
    .catch(err => this.toastr.error(err));
  }

  createDuel(): void {
    this.duelsService.create()
    .then(() => this.toastr.success('Duel created!'))
    .catch(err => this.toastr.error(err));
  }
}
