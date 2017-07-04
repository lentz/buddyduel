import { Component, OnInit } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { AuthService } from '../auth/auth.service';
import { DuelsService } from '../duels/duels.service';
import { Duel } from '../duels/duel';

@Component({
  selector: 'app-home',
  providers: [AuthService, DuelsService],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  private duels = new Array<Duel>();

  public constructor(public duelsService: DuelsService,
                     public authService: AuthService,
                     private toastr: ToastsManager, ) { }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.duelsService.getDuels().then(duels => this.duels = duels);
    }
  }

  acceptDuel(duelId: string): void {
    this.duelsService.acceptDuel(duelId)
    .then(() => this.toastr.success('Duel accepted!'))
    .catch(err => this.toastr.error(err));
  }

  activeDuels(): Duel[] {
    return this.duels.filter(duel => duel.status === 'active');
  }

  pendingDuels(): Duel[] {
    return this.duels.filter(duel => duel.status === 'pending');
  }

  createDuel(): void {
    this.duelsService.create()
    .then(() => this.toastr.success('Duel created!'))
    .catch(err => this.toastr.error(err));
  }
}
