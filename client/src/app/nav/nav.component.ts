import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { DuelsService } from '../duels/duels.service';
import { Duel } from '../duels/duel';

declare var jQuery: any;

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent {
  betAmount = 0;
  duels: Duel[] = [];
  duelAcceptedSubscription: Subscription;
  sport = '';
  sports: string[] = [];

  public constructor(
    private duelsService: DuelsService,
    public authService: AuthService,
    private toastr: ToastrService,
  ) {
    if (this.authService.isAuthenticated()) {
      this.loadDuels();
      duelsService.getSports().then((sports) => {
        this.sports = sports;
      });
    }
    this.duelAcceptedSubscription = duelsService.duelAccepted$.subscribe(
      this.loadDuels.bind(this),
    );
  }

  private loadDuels(): void {
    this.duelsService
      .getDuels({ status: 'active,suspended' })
      .then((duels) => {
        this.duels = duels;
      })
      .catch((err) => {
        console.error(err);
        this.toastr.error('Failed to get duels!');
      });
  }

  opponentName(duel: Duel): string {
    return this.duelsService.opponentForPlayers(duel.players).name;
  }

  createDuel(): void {
    this.duelsService
      .createDuel({ betAmount: this.betAmount, sport: this.sport })
      .then(() => {
        jQuery('#create-duel-modal').modal('hide');
        this.betAmount = 0;
        this.toastr.success('Duel created!');
      })
      .catch((err) => {
        console.error(err);
        this.toastr.error('Failed to create duel!');
      });
  }
}
