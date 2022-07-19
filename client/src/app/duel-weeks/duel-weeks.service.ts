import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { DuelWeek } from './duel-week';

@Injectable()
export class DuelWeeksService {
  private headers = { 'Content-Type': 'application/json' };

  private duelWeeksURL = 'api/duel-weeks';

  constructor(private http: HttpClient) {}

  getDuelWeeks(params = {}) {
    return this.http.get<DuelWeek[]>(`${this.duelWeeksURL}`, { params });
  }

  getDuelWeek(id: string) {
    return this.http.get<DuelWeek>(`${this.duelWeeksURL}/${id}`, {
      observe: 'response',
      responseType: 'json',
    });
  }

  updateDuelWeek(duelWeek: DuelWeek) {
    return this.http.put<DuelWeek>(
      `${this.duelWeeksURL}/${duelWeek._id}`,
      JSON.stringify(duelWeek),
      {
        headers: this.headers,
      },
    );
  }
}
