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

  constructor(private authHttp: AuthHttp) { }

  getDuels(status?: string): Promise<Duel[]> {
    const params = new URLSearchParams();
    params.set('status', status);
    return this.authHttp.get(this.duelsURL, { params: params })
                    .toPromise()
                    .then(response => response.json() as Duel[])
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
                 .then(response => response.json())
                 .catch(this.handleError);
  }

  create(): Promise<Duel> {
    return this.authHttp.post(`${this.duelsURL}`, null, { headers: this.headers })
                        .toPromise()
                        .then(response => response.json() as Duel)
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
    return Promise.reject(error.message || error.statusText || error);
  }
}
