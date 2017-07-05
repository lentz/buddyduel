import { Component } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { AuthService } from '../auth/auth.service';
import { DuelsService } from '../duels/duels.service';
import { Duel } from '../duels/duel';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  public constructor(public duelsService: DuelsService,
                     public authService: AuthService,
                     private toastr: ToastsManager, ) { }

  acceptDuel(duelId: string): void {
    this.duelsService.acceptDuel(duelId)
    .then(() => this.toastr.success('Duel accepted!'))
    .catch(err => this.toastr.error(err));
  }

  createDuel(): void {
    this.duelsService.create()
    .then(() => this.toastr.success('Duel created!'))
    .catch(err => this.toastr.error(err));
  }
}
