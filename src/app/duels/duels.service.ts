import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs'

import { AuthService } from '../auth/auth.service'
import { Game } from './game';
import { DuelWeek } from './duel-week';
import { Duel } from './duel';
import { Player } from './player';

@Injectable()
export class DuelsService {
  private headers = { 'Content-Type': 'application/json' };

  private duelWeeksURL = 'api/duel-weeks';
  private duelsURL = 'api/duels';

  private duelCreatedSource = new Subject<Duel>();
  private duelAcceptedSource = new Subject<Duel>();

  duelCreated$ = this.duelCreatedSource.asObservable();
  duelAccepted$ = this.duelAcceptedSource.asObservable();


  constructor(private http: HttpClient,
              private authService: AuthService, ) { }

  opponentForPlayers(players: Player[]): Player {
    const currentPlayerId = this.authService.getUserProfile().sub;
    const opponent = players.find(player => player.id !== currentPlayerId);
    if (!opponent) { throw new Error('Could not determine opponent'); }
    return opponent;
  }

  getDuel(id: string): Promise<Duel> {
    return this.http.get(`${this.duelsURL}/${id}`)
      .toPromise()
      .then((response: any) => response as Duel)
      .catch(this.handleError);
  }

  getDuels(params = {}): Promise<Duel[]> {
    return this.http.get(this.duelsURL, { params })
                    .toPromise()
                    .then((response: any) => response as Duel[])
                    .catch(this.handleError);
  }

  getDuelWeeks(params = {}): Promise<DuelWeek[]> {
    return this.http.get(`${this.duelWeeksURL}`, { params })
               .toPromise()
               .then((response: any) => response as DuelWeek[])
               .catch(this.handleError);
  }

  getWeek(id: string): Promise<DuelWeek> {
    return this.http.get(`${this.duelWeeksURL}/${id}`)
               .toPromise()
               .then((response: any) => response as DuelWeek)
               .catch(this.handleError);
  }

  acceptDuel(code: string): Promise<any> {
    return this.http.put(`${this.duelsURL}/accept`, { code },
                      { headers: this.headers })
                 .toPromise()
                 .then(() => this.duelAcceptedSource.next())
                 .catch(this.handleError);
  }

  updateDuel(duel: Duel): Promise<any> {
    return this.http.put(
      `${this.duelsURL}/${duel._id}`,
      duel,
      { headers: this.headers },
    )
    .toPromise()
    .catch(this.handleError);
  }

  deleteDuel(duelId: string): Promise<any> {
    return this.http.delete(`${this.duelsURL}/${duelId}`,
                      { headers: this.headers })
                 .toPromise()
                 .catch(this.handleError);
  }

  create(betAmount: number): Promise<any> {
    return this.http.post(`${this.duelsURL}`, { betAmount }, { headers: this.headers })
                        .toPromise()
                        .then((response: any) => this.duelCreatedSource.next(response as Duel))
                        .catch(this.handleError);
  }

  save(duelWeek: DuelWeek): Promise<DuelWeek> {
    return this.http.put(`${this.duelWeeksURL}/${duelWeek._id}`,
                         JSON.stringify(duelWeek),
                         { headers: this.headers })
                    .toPromise()
                    .then((response: any) => response as DuelWeek)
                    .catch(this.handleError);
  }

  private handleError(res: any): Promise<any> {
    if (res.error.message) { return Promise.reject(res.error.message); }
    return Promise.reject(res.statusText);
  }
}
