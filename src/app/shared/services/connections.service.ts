import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Connections } from '../models/Connections';
import { Connections_Results } from '../models/IConnectionsResults';
import { Gamedata_Connections } from '../models/IGamedata_Connections';

@Injectable({
  providedIn: 'root',
})
export class ConnectionsService {
  private myAppUrl: string;
  private myApiUrl: string;
  private http = inject(HttpClient);

  constructor() {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/connections/';
  }

  async getGamedataTC() {
    try {
      const results = await this.getGamedata().toPromise();
      if (!results) {
        return undefined;
      }
      return results;
    } catch (error) {
      return undefined;
    }
  }

  getGamedata(): Observable<Connections> {
    return this.http.get<Connections>(
      `${this.myAppUrl}${this.myApiUrl}gamedata`
    );
  }

  async getGamedataResultsTC(gameID: string, type: string) {
    try {
      const results = await this.getGamedataResults(gameID, type).toPromise();
      if (!results) {
        return undefined;
      }
      return results;
    } catch (error) {
      return undefined;
    }
  }

  getGamedataResults(
    gameID: string,
    type: string
  ): Observable<Connections_Results> {
    return this.http.get<Connections_Results>(
      `${this.myAppUrl}${this.myApiUrl}gamedata/results/${gameID}/${type}`
    );
  }

  async guessGroupTC(gameID: string, resultIDs: string[]) {
    try {
      const results = await this.guessGroup(gameID, resultIDs).toPromise();
      if (!results) {
        return undefined;
      }
      return results;
    } catch (error) {
      return undefined;
    }
  }

  guessGroup(
    gameID: string,
    resultIDs: string[]
  ): Observable<Gamedata_Connections> {
    const gamedata = {
      gameID: gameID,
      resultIDs: resultIDs,
    };
    return this.http.post<Gamedata_Connections>(
      `${this.myAppUrl}${this.myApiUrl}guess`,
      gamedata
    );
  }
}
