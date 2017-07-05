import { Injectable } from '@angular/core';
import { Headers, URLSearchParams } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/toPromise';

import { Game } from './game';
import { DuelWeek } from './duel-week';
import { Duel } from './duel';

@Injectable()
export class DuelsService {
  private headers = new Headers({'Content-Type': 'application/json'});

  private duelWeeksURL = 'api/duel-weeks';
  private duelsURL = 'api/duels';

  public duels = new Array<Duel>();
  public duelWeeks = new Array<DuelWeek>();

  constructor(private authHttp: AuthHttp) { }

  activeDuels(): Duel[] {
    return this.duels.filter(duel => duel.status === 'active');
  }

  pendingDuels(): Duel[] {
    return this.duels.filter(duel => duel.status === 'pending');
  }

  getDuels(status?: string): Promise<Duel[]> {
    const params = new URLSearchParams();
    params.set('status', status);
    return this.authHttp.get(this.duelsURL, { params: params })
                    .toPromise()
                    .then(response => this.duels = response.json() as Duel[])
                    .catch(this.handleError);
  }

  getDuelWeeks(duelId: string): Promise<DuelWeek[]> {
    return this.authHttp.get(`${this.duelWeeksURL}?duelId=${duelId}`)
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

  acceptDuel(duelId: string): Promise<any> {
    return this.authHttp.put(`${this.duelsURL}/${duelId}/accept`, null,
                      { headers: this.headers })
                 .toPromise()
                 .then(() => this.getDuels())
                 .catch(this.handleError);
  }

  create(): Promise<any> {
    return this.authHttp.post(`${this.duelsURL}`, null, { headers: this.headers })
                        .toPromise()
                        .then(() => this.getDuels())
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
    return Promise.reject(error.json().message || error.statusText || error);
  }
}
