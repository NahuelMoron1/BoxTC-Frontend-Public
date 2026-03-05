import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { StartGuess, Surrendered } from '../models/GuessTeams';
import {
  GuessAllResults,
  GuessOneResults,
} from '../models/Guess_Teams_Results';

@Injectable({
  providedIn: 'root',
})
export class GuessTeamService {
  private myAppUrl: string;
  private myApiUrl: string;
  private http = inject(HttpClient);

  constructor() {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/guess-teams/';
  }

  async getGameTC() {
    try {
      const data = await this.getGame().toPromise();
      return data;
    } catch (error) {
      return undefined;
    }
  }

  getGame(): Observable<StartGuess> {
    return this.http.get<StartGuess>(`${this.myAppUrl}${this.myApiUrl}play`);
  }

  async guessOneTC(type: string, id: string) {
    try {
      const data = await this.guessOne(type, id).toPromise();
      return data;
    } catch (error) {
      return undefined;
    }
  }

  guessOne(type: string, id: string): Observable<GuessOneResults> {
    const data = { type, id };
    return this.http.post<GuessOneResults>(
      `${this.myAppUrl}${this.myApiUrl}guessOne`,
      data
    );
  }

  async guessAllTC(
    teamID: string,
    driver1ID: string,
    driver2ID: string,
    tpID: string
  ) {
    try {
      const data = await this.guessAll(
        teamID,
        driver1ID,
        driver2ID,
        tpID
      ).toPromise();
      return data;
    } catch (error) {
      return undefined;
    }
  }

  guessAll(
    teamID: string,
    driver1ID: string,
    driver2ID: string,
    tpID: string
  ): Observable<GuessAllResults> {
    const data = { teamID, driver1ID, driver2ID, tpID };
    return this.http.post<GuessAllResults>(
      `${this.myAppUrl}${this.myApiUrl}guessAll`,
      data
    );
  }

  async surrenderTC() {
    try {
      const data = await this.surrender().toPromise();
      return data;
    } catch (error) {
      return undefined;
    }
  }

  surrender(): Observable<Surrendered> {
    return this.http.get<Surrendered>(
      `${this.myAppUrl}${this.myApiUrl}surrender`
    );
  }
}
