import { Injectable } from '@angular/core';
import { Headers, URLSearchParams } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Subject } from 'rxjs/Subject'
import 'rxjs/add/operator/toPromise';

import { AuthService } from '../auth/auth.service'
import { Game } from './game';
import { DuelWeek } from './duel-week';
import { Duel } from './duel';
import { Player } from './player';

@Injectable()
export class DuelsService {
  private headers = new Headers({'Content-Type': 'application/json'});

  private duelWeeksURL = 'api/duel-weeks';
  private duelsURL = 'api/duels';

  private duelCreatedSource = new Subject<Duel>();
  duelCreated$ = this.duelCreatedSource.asObservable();

  constructor(private authHttp: AuthHttp,
              private authService: AuthService, ) { }

  opponentForPlayers(players: Player[]): string {
    const currentPlayerId = this.authService.getUserProfile().sub;
    return players.find(player => player.id !== currentPlayerId).name;
  }

  getDuels(params = {}): Promise<Duel[]> {
    return this.authHttp.get(this.duelsURL, { params })
                    .toPromise()
                    .then(response => response.json() as Duel[])
                    .catch(this.handleError);
  }

  getDuelWeeks(params = {}): Promise<DuelWeek[]> {
    return this.authHttp.get(`${this.duelWeeksURL}`, { params })
               .toPromise()
               .then(response => response.json() as DuelWeek[])
               .catch(this.handleError);
  }

  getWeek(id: string): Promise<DuelWeek> {
    return this.authHttp.get(`${this.duelWeeksURL}/${id}`)
               .toPromise()
               .then(response => response.json() as DuelWeek)
               .catch(this.handleError);
  }

  acceptDuel(code: string): Promise<any> {
    return this.authHttp.put(`${this.duelsURL}/accept`, { code },
                      { headers: this.headers })
                 .toPromise()
                 .catch(this.handleError);
  }

  deleteDuel(duelId: string): Promise<any> {
    return this.authHttp.delete(`${this.duelsURL}/${duelId}`,
                      { headers: this.headers })
                 .toPromise()
                 .catch(this.handleError);
  }

  create(betAmount: number): Promise<any> {
    return this.authHttp.post(`${this.duelsURL}`, { betAmount }, { headers: this.headers })
                        .toPromise()
                        .then(response => this.duelCreatedSource.next(response.json() as Duel))
                        .catch(this.handleError);
  }

  save(duelWeek: DuelWeek): Promise<DuelWeek> {
    return this.authHttp.put(`${this.duelWeeksURL}/${duelWeek._id}`,
                         JSON.stringify(duelWeek),
                         { headers: this.headers })
                    .toPromise()
                    .then(response => response.json() as DuelWeek)
                    .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    if (error.json) { error = error.json().message; }
    return Promise.reject(error.statusText || error);
  }
}
