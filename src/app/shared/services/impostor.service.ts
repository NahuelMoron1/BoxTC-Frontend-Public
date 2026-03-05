import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Gamedata_Impostor,
  Gamedata_ImpostorByOne,
  Gamedata_ImpostorSurrender,
} from '../models/IGamedata_Impostor';
import { Top10Gamedata } from '../models/ITop10Gamedata';

@Injectable({
  providedIn: 'root',
})
export class ImpostorService {
  private myAppUrl: string;
  private myApiUrl: string;
  private http = inject(HttpClient);

  constructor() {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/impostor/';
  }

  async getGamedataTC() {
    try {
      const data = await this.getGamedata().toPromise();
      return data;
    } catch (error) {
      return undefined;
    }
  }

  getGamedata(): Observable<Top10Gamedata> {
    return this.http.get<Top10Gamedata>(
      `${this.myAppUrl}${this.myApiUrl}gamedata`
    );
  }

  async playOneByOneGameTC(
    gameID: string,
    resultID: string,
    tryNumber: number
  ) {
    try {
      const data = await this.playOneByOneGame(
        gameID,
        resultID,
        tryNumber
      ).toPromise();
      return data;
    } catch (error) {
      return undefined;
    }
  }

  playOneByOneGame(
    gameID: string,
    resultID: string,
    tryNumber: number
  ): Observable<Gamedata_ImpostorByOne> {
    return this.http.post<Gamedata_ImpostorByOne>(
      `${this.myAppUrl}${this.myApiUrl}play/oneByOne`,
      {
        resultID,
        gameID,
        tryNumber,
      }
    );
  }

  async playNormalGameTC(gameID: string, IDs: string[]) {
    try {
      const data = await this.playNormalGame(gameID, IDs).toPromise();
      return data;
    } catch (error) {
      return undefined;
    }
  }

  playNormalGame(gameID: string, IDs: string[]): Observable<Gamedata_Impostor> {
    return this.http.post<Gamedata_Impostor>(
      `${this.myAppUrl}${this.myApiUrl}play/normal`,
      {
        IDs,
        gameID,
      }
    );
  }

  async surrenderTC(gameID: string) {
    try {
      const data = await this.surrender(gameID).toPromise();
      return data;
    } catch (error) {
      return undefined;
    }
  }

  surrender(gameID: string): Observable<Gamedata_ImpostorSurrender> {
    return this.http.post<Gamedata_ImpostorSurrender>(
      `${this.myAppUrl}${this.myApiUrl}giveup`,
      {
        gameID,
      }
    );
  }
}
