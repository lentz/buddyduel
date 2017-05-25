import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Matchup } from './matchup';

@Injectable()
export class MatchupsService {
  private headers = new Headers({'Content-Type': 'application/json'});

  private matchupsURL = 'api/matchups';

  constructor(private http: Http) { }

  getWeek(week: number): Promise<Matchup[]> {
    return this.http.get(`${this.matchupsURL}/${week}`)
               .toPromise()
               .then(response => response.json() as Matchup[])
               .catch(this.handleError);
  }

  save(matchups: Matchup[]): Promise<Matchup[]> {
    return this.http.put(`${this.matchupsURL}`,
                         JSON.stringify(matchups),
                         { headers: this.headers })
                    .toPromise()
                    .then(() => matchups)
                    .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}
