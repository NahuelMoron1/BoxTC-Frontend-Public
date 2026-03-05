import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Timeline } from '../models/Timeline';
import { TimelineEvent } from '../models/TimelineEvent';

@Injectable({
  providedIn: 'root',
})
export class TimelineService {
  private myAppUrl: string;
  private myApiUrl: string;
  private http = inject(HttpClient);
  constructor() {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/timeline/';
  }

  async getTodayTimelineTC() {
    try {
      const data = await this.getTodayTimeline().toPromise();
      return data;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  // Trae el timeline de hoy con sus eventos (sin exponer fechas)
  getTodayTimeline(): Observable<{
    timeline: Timeline;
    events: TimelineEvent[];
  }> {
    return this.http.get<{ timeline: Timeline; events: TimelineEvent[] }>(
      `${this.myAppUrl}${this.myApiUrl}today`,
      { withCredentials: true },
    );
  }

  // Verifica si el orden de los eventos es correcto
  verifyTimeline(
    timelineId: string,
    orderedIds: string[],
  ): Observable<{ gameWon: boolean; correctOrder: TimelineEvent[] }> {
    return this.http.post<{ gameWon: boolean; correctOrder: TimelineEvent[] }>(
      `${this.myAppUrl}${this.myApiUrl}verify/${timelineId}`,
      { orderedIds },
      { withCredentials: true },
    );
  }
}
