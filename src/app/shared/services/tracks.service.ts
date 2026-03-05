import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Track } from '../models/Track';

@Injectable({
  providedIn: 'root',
})
export class TracksService {
  private myAppUrl: string;
  private myApiUrl: string;
  private http = inject(HttpClient);

  constructor() {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/tracks/';
  }

  async getAllTracksTC() {
    try {
      const data = await this.getAllTracks().toPromise();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error obteniendo datos:', error.message);
      }
      throw error; // Puedes manejar el error de acuerdo a tus necesidades
    }
  }

  getAllTracks(): Observable<Track[]> {
    return this.http.get<Track[]>(this.myAppUrl + this.myApiUrl + 'tracks');
  }
}
