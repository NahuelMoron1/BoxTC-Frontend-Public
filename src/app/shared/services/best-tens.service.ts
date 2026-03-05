import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Suggestions } from '../models/ISuggestions';
import { Top10Data } from '../models/ITop10Data';
import { Top10Gamedata } from '../models/ITop10Gamedata';

@Injectable({
  providedIn: 'root',
})
export class BestTensService {
  private myAppUrl: string;
  private myApiUrl: string;
  private http = inject(HttpClient);

  constructor() {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/best10/';
  }

  async giveUpTC(gameID: string, type: string) {
    try {
      const gamedata = await this.giveUp(gameID, type).toPromise();
      return gamedata;
    } catch (error) {
      return undefined;
    }
  }

  giveUp(gameID: string, type: string): Observable<Top10Data[]> {
    return this.http.get<Top10Data[]>(
      this.myAppUrl + this.myApiUrl + 'giveup/' + gameID + '/' + type
    );
  }

  async getSuggestionsTC(type: string, input: string) {
    try {
      const gamedata = await this.getSuggestions(type, input).toPromise();
      return gamedata || [];
    } catch (error) {
      return [];
    }
  }

  getSuggestions(type: string, input: string): Observable<Suggestions[]> {
    return this.http.get<Suggestions[]>(
      this.myAppUrl + this.myApiUrl + 'suggestions/' + type + '/' + input
    );
  }

  async getGamedataTC() {
    try {
      const gamedata = await this.getGamedata().toPromise();
      return gamedata;
    } catch (error) {
      return undefined;
    }
  }

  getGamedata(): Observable<Top10Gamedata> {
    return this.http.get<Top10Gamedata>(
      this.myAppUrl + this.myApiUrl + 'gamedata'
    );
  }

  async getBesto10TC(gameID: string, type: string, resultID: string) {
    try {
      const best_tens = await this.getBest10(
        gameID,
        type,
        resultID
      ).toPromise();
      return best_tens;
    } catch (error) {
      return undefined;
    }
  }

  getBest10(
    gameID: string,
    type: string,
    input: string
  ): Observable<Top10Data> {
    return this.http.get<Top10Data>(
      this.myAppUrl +
        this.myApiUrl +
        'play/' +
        input +
        '/' +
        type +
        '/' +
        gameID
    );
  }
}
