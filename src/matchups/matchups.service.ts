import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Matchup } from './matchup';

@Injectable()
export class MatchupsService {
  private matchupsURL = 'api/matchups';

  constructor(private http: Http) { }

  getWeek(week: number): Promise<Matchup[]> {
    return this.http.get(`${this.matchupsURL}/${week}`)
               .toPromise()
               .then(response => response.json() as Matchup[])
               .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}
