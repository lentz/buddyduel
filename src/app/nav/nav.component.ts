import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { AuthService } from '../auth/auth.service'
import { DuelsService } from '../duels/duels.service'
import { Duel } from '../duels/duel';

declare var jQuery: any;

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  betAmount = 0;
  activeDuels: Duel[] = [];

  public constructor(private duelsService: DuelsService,
                     public authService: AuthService,
                     private toastr: ToastsManager, ) { }


  ngOnInit(): void {
    // FIXME: Load after initial login
    // FIXME: Subscribe to duel acceptance
    this.authService.checkSession(() => {
      if (this.authService.isAuthenticated()) {
        this.updateActiveDuels();
      }
    });
  }

  private updateActiveDuels(): void {
    this.duelsService.getDuels({ status: 'active' })
      .then(duels => this.activeDuels = duels)
      .catch(err => {
        console.error(err);
        this.toastr.error('Failed to get active duels!');
      });
  }

  opponentName(duel: Duel): string {
    return this.duelsService.opponentForPlayers(duel.players);
  }

  createDuel(): void {
    this.duelsService.create(this.betAmount)
    .then(() => {
      jQuery('#create-duel-modal').modal('hide');
      this.betAmount = 0;
      this.toastr.success('Duel created!');
    })
    .catch(err => {
      console.error(err);
      this.toastr.error('Failed to create duel!');
    });
  }
}
