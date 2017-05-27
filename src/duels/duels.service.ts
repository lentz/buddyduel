import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Game } from './game';
import { DuelWeek } from './duel-week';

@Injectable()
export class DuelsService {
  private headers = new Headers({'Content-Type': 'application/json'});

  private duelsURL = 'api/duel-weeks';

  constructor(private http: Http) { }

  getDuelIds(): Promise<string[]> {
    return this.http.get(`${this.duelsURL}`)
               .toPromise()
               .then(response => response.json())
               .catch(this.handleError);
  }

  getWeek(id: string): Promise<DuelWeek> {
    return this.http.get(`${this.duelsURL}/${id}`)
               .toPromise()
               .then(response => response.json() as Game[])
               .catch(this.handleError);
  }

  save(duelWeek: DuelWeek): Promise<Game[]> {
    return this.http.put(`${this.duelsURL}/${duelWeek._id}`,
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
