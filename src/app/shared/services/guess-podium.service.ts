import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { StartGuess, Surrendered } from '../models/GuessPodiums';
import {
  GuessAllResults,
  GuessOneResults,
} from '../models/Guess_Podiums_Results';

@Injectable({
  providedIn: 'root',
})
export class GuessPodiumService {
  private myAppUrl: string;
  private myApiUrl: string;
  private http = inject(HttpClient);

  constructor() {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/guess-podiums/';
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

  async guessOneTC(type: string, position: string, id: string) {
    try {
      const data = await this.guessOne(type, position, id).toPromise();
      return data;
    } catch (error) {
      return undefined;
    }
  }

  guessOne(
    type: string,
    position: string,
    id: string,
  ): Observable<GuessOneResults> {
    const data = { type, position, id };
    return this.http.post<GuessOneResults>(
      `${this.myAppUrl}${this.myApiUrl}guessOne`,
      data,
    );
  }

  async guessAllTC(
    firstDriverID: string,
    secondDriverID: string,
    thirdDriverID: string,
    firstCarID: string,
    secondCarID: string,
    thirdCarID: string,
  ) {
    try {
      const data = await this.guessAll(
        firstDriverID,
        secondDriverID,
        thirdDriverID,
        firstCarID,
        secondCarID,
        thirdCarID,
      ).toPromise();
      return data;
    } catch (error) {
      return undefined;
    }
  }

  guessAll(
    firstDriverID: string,
    secondDriverID: string,
    thirdDriverID: string,
    firstCarID: string,
    secondCarID: string,
    thirdCarID: string,
  ): Observable<GuessAllResults> {
    const data = {
      firstDriverID,
      secondDriverID,
      thirdDriverID,
      firstCarID,
      secondCarID,
      thirdCarID,
    };
    return this.http.post<GuessAllResults>(
      `${this.myAppUrl}${this.myApiUrl}guessAll`,
      data,
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
      `${this.myAppUrl}${this.myApiUrl}surrender`,
    );
  }
}
