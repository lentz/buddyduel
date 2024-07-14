import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, merge, Observable } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { DuelsService } from '../duels/duels.service';
import { Duel } from '../duels/duel';
import { switchMap } from 'rxjs/operators';

declare const jQuery: (selector: string) => { modal: (toggle: string) => void };

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent {
  betAmount = 0;
  refreshDuels$ = new BehaviorSubject<boolean>(true);
  duels$!: Observable<Duel[]>;
  sport = '';
  sports: string[] = [];

  public constructor(
    private duelsService: DuelsService,
    public authService: AuthService,
    private toastr: ToastrService,
  ) {
    if (this.authService.isAuthenticated()) {
      this.duels$ = merge(this.refreshDuels$, duelsService.duelAccepted$).pipe(
        switchMap(() =>
          this.duelsService.getDuels({ status: 'active,suspended' }),
        ),
      );
      duelsService.getSports().then((sports) => {
        this.sports = sports;
      });
    }
  }

  opponentName(duel: Duel): string {
    return this.duelsService.opponentForPlayers(duel.players).name;
  }

  createDuel(): void {
    this.duelsService
      .createDuel({ betAmount: this.betAmount, sport: this.sport })
      .subscribe({
        next: () => {
          jQuery('#create-duel-modal').modal('hide');
          this.betAmount = 0;
          this.toastr.success('Duel created!');
        },
        error: (err: unknown) => {
          console.error(err);
          this.toastr.error('Failed to create duel!');
        },
      });
  }
}
