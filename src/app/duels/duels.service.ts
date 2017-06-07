import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
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

  getDuels(): Promise<Duel[]> {
    return this.authHttp.get(this.duelsURL)
                    .toPromise()
                    .then(response => response.json() as Duel[])
                    .catch(this.handleError);
  }

  getDuelWeekIds(duelId: string): Promise<string[]> {
    return this.authHttp.get(`${this.duelWeeksURL}?duelId=${duelId}`)
               .toPromise()
               .then(response => response.json())
               .catch(this.handleError);
  }

  getWeek(id: string): Promise<DuelWeek> {
    return this.authHttp.get(`${this.duelWeeksURL}/${id}`)
               .toPromise()
               .then(response => response.json() as Game[])
               .catch(this.handleError);
  }

  save(duelWeek: DuelWeek): Promise<Game[]> {
    return this.authHttp.put(`${this.duelWeeksURL}/${duelWeek._id}`,
                         JSON.stringify(duelWeek),
                         { headers: this.headers })
                    .toPromise()
                    .then(() => duelWeek)
                    .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}
