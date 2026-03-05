import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Season } from '../models/Season';

@Injectable({
  providedIn: 'root',
})
export class SeasonsService {
  private myAppUrl: string;
  private myApiUrl: string;
  private http = inject(HttpClient);

  constructor() {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/seasons/';
  }

  async getAllSeasonsTC() {
    try {
      const data = await this.getAllSeasons().toPromise();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error obteniendo datos:', error.message);
      }
      throw error; // Puedes manejar el error de acuerdo a tus necesidades
    }
  }

  getAllSeasons(): Observable<Season[]> {
    return this.http.get<Season[]>(this.myAppUrl + this.myApiUrl + 'seasons');
  }
}
