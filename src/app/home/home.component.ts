import { Component, OnInit } from '@angular/core';

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
                     public authService: AuthService, ) { }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.duelsService.getDuels().then(duels => this.duels = duels);
    }
  }

  acceptDuel(duelId: string): void {
    this.duelsService.acceptDuel(duelId);
  }

  activeDuels(): Duel[] {
    return this.duels.filter(duel => duel.status === 'active');
  }

  pendingDuels(): Duel[] {
    return this.duels.filter(duel => duel.status === 'pending');
  }

  createDuel(): void {
    this.duelsService.create();
  }
}
