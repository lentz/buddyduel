import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthService } from '../auth/auth.service'
import { DuelWeek } from './duel-week';

@Injectable()
export class DuelWeeksService {
  private headers = { 'Content-Type': 'application/json' };

  private duelWeeksURL = 'api/duel-weeks';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getDuelWeeks(params = {}): Promise<DuelWeek[]> {
    return this.http.get(`${this.duelWeeksURL}`, { params })
               .toPromise()
               .then((response: any) => response as DuelWeek[])
               .catch(this.handleError);
  }

  getDuelWeek(id: string): Promise<DuelWeek> {
    return this.http.get(`${this.duelWeeksURL}/${id}`)
               .toPromise()
               .then((response: any) => response as DuelWeek)
               .catch(this.handleError);
  }

  updateDuelWeek(duelWeek: DuelWeek): Promise<DuelWeek> {
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
