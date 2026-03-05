import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Season_Track } from '../models/Season_Track';

@Injectable({
  providedIn: 'root',
})
export class SeasonTracksService {
  private myAppUrl: string;
  private myApiUrl: string;
  private http = inject(HttpClient);

  constructor() {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/seasons_tracks/';
  }

  async getAllSeasonTracksTC() {
    try {
      const data = await this.getAllSeasonTracks().toPromise();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error obteniendo datos:', error.message);
      }
      throw error; // Puedes manejar el error de acuerdo a tus necesidades
    }
  }

  getAllSeasonTracks(): Observable<Season_Track[]> {
    return this.http.get<Season_Track[]>(
      this.myAppUrl + this.myApiUrl + 'season_tracks'
    );
  }
}
