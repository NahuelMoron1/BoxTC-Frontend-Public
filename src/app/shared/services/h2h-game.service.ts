import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { H2HGames } from '../models/h2h-games';
import { H2HGameResponse } from '../models/h2h-game-response';

@Injectable({
  providedIn: 'root',
})
export class H2hGameService {
  private myAppUrl: string;
  private myApiUrl: string;
  private http = inject(HttpClient);
  constructor() {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/h2h-games/';
  }

  async getGameDataTC() {
    try {
      const data = await this.getGameData().toPromise();
      return data;
    } catch (error) {
      return undefined;
    }
  }

  getGameData(): Observable<H2HGameResponse> {
    return this.http.get<H2HGameResponse>(
      this.myAppUrl + this.myApiUrl + 'play'
    );
  }

  async guessOneByOneGameTC(
    gameID: string,
    guessData: { type: string; id: string; gameID: string }
  ) {
    try {
      const data = await this.guessOneByOneGame(guessData).toPromise();
      return data;
    } catch (error) {
      return undefined;
    }
  }

  async guessAllGameTC(
    gameID: string,
    guessData: { type: string; driverID: string }[]
  ) {
    try {
      const data = await this.guessAllGame(gameID, guessData).toPromise();
      return data;
    } catch (error) {
      return undefined;
    }
  }

  guessOneByOneGame(guessData: {
    type: string;
    id: string;
    gameID: string;
  }): Observable<H2HGames> {
    return this.http.post<H2HGames>(
      this.myAppUrl + this.myApiUrl + 'guessOne',
      guessData
    );
  }

  guessAllGame(
    gameID: string,
    guessData: { type: string; driverID: string }[]
  ): Observable<H2HGames> {
    return this.http.post<H2HGames>(
      this.myAppUrl + this.myApiUrl + 'guessAll',
      {
        gameID,
        data: guessData,
      }
    );
  }
}
