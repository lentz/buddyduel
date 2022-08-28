import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { Duel } from './duel';
import { Player } from './player';

@Injectable()
export class DuelsService {
  private headers = { 'Content-Type': 'application/json' };

  private duelsURL = 'api/duels';

  private duelCreatedSource = new Subject<Duel>();
  private duelAcceptedSource = new Subject<boolean>();

  duelCreated$ = this.duelCreatedSource.asObservable();
  duelAccepted$ = this.duelAcceptedSource.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {}

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

  async acceptDuel(code: string): Promise<any> {
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

  updateDuel(duel: Duel): Promise<any> {
    return this.http
      .put(`${this.duelsURL}/${duel._id}`, duel, { headers: this.headers })
      .toPromise()
      .catch(this.handleError);
  }

  deleteDuel(duelId: string): Promise<any> {
    return this.http
      .delete(`${this.duelsURL}/${duelId}`, { headers: this.headers })
      .toPromise()
      .catch(this.handleError);
  }

  createDuel(duelOpts: { betAmount: number; sport: string }): Promise<any> {
    return this.http
      .post(`${this.duelsURL}`, duelOpts, { headers: this.headers })
      .toPromise()
      .then((response: any) => this.duelCreatedSource.next(response as Duel))
      .catch(this.handleError);
  }

  getSports(): Promise<string[]> {
    return this.http
      .get(`${this.duelsURL}/sports`, { headers: this.headers })
      .toPromise()
      .then((response: any) => response as string[])
      .catch(this.handleError);
  }

  private handleError(res: any): Promise<any> {
    if (res.error.message) {
      return Promise.reject(res.error.message);
    }
    return Promise.reject(res.statusText);
  }
}
