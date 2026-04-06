import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  GuessDriverGameData,
  GuessDriverGuessResponse,
  GuessDriverHintResponse,
  GuessDriverSurrenderResponse,
} from '../models/GuessDriver';

@Injectable({
  providedIn: 'root',
})
export class GuessDriverService {
  private myAppUrl: string;
  private myApiUrl: string;
  private http = inject(HttpClient);

  constructor() {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/guess-driver/';
  }

  /**
   * Obtener el juego del día
   */
  async getGameOfTheDayTC() {
    try {
      const data = await this.getGameOfTheDay().toPromise();
      return data;
    } catch (error) {
      console.error('Error fetching game of the day:', error);
      return undefined;
    }
  }

  getGameOfTheDay(): Observable<GuessDriverGameData> {
    return this.http.get<GuessDriverGameData>(
      `${this.myAppUrl}${this.myApiUrl}play`,
    );
  }

  /**
   * Hacer un intento de adivinanza
   */
  async guessDriverTC(gameId: string, guessedDriverId: string) {
    try {
      const data = await this.guessDriver(gameId, guessedDriverId).toPromise();
      return data;
    } catch (error) {
      console.error('Error guessing driver:', error);
      return undefined;
    }
  }

  guessDriver(
    gameId: string,
    guessedDriverId: string,
  ): Observable<GuessDriverGuessResponse> {
    const payload = { gameId, guessedDriverId };
    return this.http.post<GuessDriverGuessResponse>(
      `${this.myAppUrl}${this.myApiUrl}guess`,
      payload,
    );
  }

  /**
   * Obtener la siguiente pista
   */
  async getNextHintTC(gameId: string, attemptNumber: number) {
    try {
      const data = await this.getNextHint(gameId, attemptNumber).toPromise();
      return data;
    } catch (error) {
      console.error('Error getting hint:', error);
      return undefined;
    }
  }

  getNextHint(
    gameId: string,
    attemptNumber: number,
  ): Observable<GuessDriverHintResponse> {
    const payload = { gameId, attemptNumber };
    return this.http.post<GuessDriverHintResponse>(
      `${this.myAppUrl}${this.myApiUrl}hint`,
      payload,
    );
  }

  /**
   * Rendirse/ver la respuesta
   */
  async surrenderGameTC(gameId: string) {
    try {
      const data = await this.surrenderGame(gameId).toPromise();
      return data;
    } catch (error) {
      console.error('Error surrendering game:', error);
      return undefined;
    }
  }

  surrenderGame(gameId: string): Observable<GuessDriverSurrenderResponse> {
    const payload = { gameId };
    return this.http.post<GuessDriverSurrenderResponse>(
      `${this.myAppUrl}${this.myApiUrl}surrender`,
      payload,
    );
  }
}
