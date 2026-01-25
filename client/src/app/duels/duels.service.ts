import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, tap } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { Duel } from './duel';
import { Player } from './player';

@Injectable()
export class DuelsService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private headers = { 'Content-Type': 'application/json' };

  private duelsURL = 'api/duels';

  private duelCreatedSource = new Subject<Duel>();
  private duelAcceptedSource = new Subject<boolean>();

  duelCreated$ = this.duelCreatedSource.asObservable();
  duelAccepted$ = this.duelAcceptedSource.asObservable();

  opponentForPlayers(players: Player[]): Player {
    const currentPlayerId = this.authService.getUser().id;
    const opponent = players.find((player) => player.id !== currentPlayerId);
    return opponent ?? new Player();
  }

  getDuel(id: string) {
    return this.http.get<Duel>(`${this.duelsURL}/${id}`);
  }

  getDuels(params = {}) {
    return this.http.get<Duel[]>(this.duelsURL, { params });
  }

  async acceptDuel(code: string) {
    return this.http
      .put<{ message: string }>(
        `${this.duelsURL}/accept`,
        { code },
        { headers: this.headers },
      )
      .toPromise()
      .then(() => this.duelAcceptedSource.next(true))
      .catch(this.handleError);
  }

  async updateDuel(duel: Duel) {
    return this.http
      .put(`${this.duelsURL}/${duel._id}`, duel, { headers: this.headers })
      .toPromise()
      .catch(this.handleError);
  }

  deleteDuel(duelId: string) {
    return this.http.delete<{ message: string }>(`${this.duelsURL}/${duelId}`, {
      headers: this.headers,
    });
  }

  createDuel(duelOpts: { betAmount: number; sport: string }) {
    return this.http
      .post<Duel>(`${this.duelsURL}`, duelOpts, {
        headers: this.headers,
      })
      .pipe(tap((duel) => this.duelCreatedSource.next(duel)));
  }

  getSports(): Promise<string[]> {
    return this.http
      .get(`${this.duelsURL}/sports`, { headers: this.headers })
      .toPromise()
      .then((response) => response as string[])
      .catch(this.handleError);
  }

  private handleError(res: {
    error?: { message: string };
    statusText?: string;
  }) {
    if (res.error?.message) {
      return Promise.reject(res.error.message);
    }
    return Promise.reject(res.statusText);
  }
}
