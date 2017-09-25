import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { AuthService } from '../auth/auth.service';
import { DuelsService } from '../duels/duels.service';
import { DuelWeek } from '../duels/duel-week';

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

  currentDuels(): DuelWeek[] {
    const maxWeek = Math.max(...this.duelsService.duelWeeks.map(week => week.weekNum));
    return this.duelsService.duelWeeks.filter(week => week.weekNum === maxWeek);
  }

  opponentName(duelWeek: DuelWeek): string {
    return this.duelsService.opponentForDuel(
      this.duelsService.duels.find(duel => duel._id === duelWeek.duelId)
    );
  }

  acceptDuel(): void {
    this.duelsService.acceptDuel(this.acceptCode)
    .then(() => {
      this.acceptCode = '';
      this.toastr.success('Duel accepted!')
    })
    .catch(err => this.toastr.error(err));
  }

  deleteDuel(duelId): void {
    this.duelsService.deleteDuel(duelId)
    .then(() => {
      this.toastr.success('Duel deleted')
    })
    .catch(err => this.toastr.error(err));
  }
}
