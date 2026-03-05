import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Team } from '../models/Team';

@Injectable({
  providedIn: 'root',
})
export class TeamsService {
  private myAppUrl: string;
  private myApiUrl: string;
  private http = inject(HttpClient);

  constructor() {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/teams/';
  }

  async getAllTeamsTC() {
    try {
      const data = await this.getAllTeams().toPromise();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error obteniendo datos:', error.message);
      }
      throw error; // Puedes manejar el error de acuerdo a tus necesidades
    }
  }

  getAllTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(this.myAppUrl + this.myApiUrl + 'teams');
  }
}
