import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { GuessDrivers, GuessDriversComplete } from '../models/GuessDrivers';

interface DriverGuessResponse {
  correct: boolean;
  driver: {
    id: string;
    firstname: string;
    lastname: string;
    nationality: string;
    image: string;
  } | null;
}

interface NextTeamResponse {
  team: {
    id: string;
    team: {
      id: string;
      name: string;
      common_name: string;
      logo: string;
    };
    ordered: number;
    start_year?: number;
    end_year?: number;
  };
  isLastTeam: boolean;
}

interface HintResponse {
  hint: {
    type: string;
    value: any;
  };
}

@Injectable({
  providedIn: 'root'
})
export class GuessDriversService {
  private myAppUrl: string;
  private myApiUrl: string;
  private http = inject(HttpClient);

  constructor() {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/guess-drivers/';
  }

  async getGameTC() {
    try {
      const data = await this.getGame().toPromise();
      return data;
    } catch (error) {
      return undefined;
    }
  }

  getGame(): Observable<GuessDriversComplete> {
    return this.http.get<GuessDriversComplete>(`${this.myAppUrl}${this.myApiUrl}play`);
  }

  async guessDriverTC(gameId: string, driverGuess: string) {
    try {
      const data = await this.guessDriver(gameId, driverGuess).toPromise();
      return data;
    } catch (error) {
      return undefined;
    }
  }

  guessDriver(gameId: string, driverGuess: string): Observable<DriverGuessResponse> {
    const data = { gameId, driverGuess };
    return this.http.post<DriverGuessResponse>(
      `${this.myAppUrl}${this.myApiUrl}guess`,
      data
    );
  }

  async getNextTeamTC(gameId: string, currentTeamCount: number) {
    try {
      const data = await this.getNextTeam(gameId, currentTeamCount).toPromise();
      return data;
    } catch (error) {
      return undefined;
    }
  }

  getNextTeam(gameId: string, currentTeamCount: number): Observable<NextTeamResponse> {
    const data = { gameId, currentTeamCount };
    return this.http.post<NextTeamResponse>(
      `${this.myAppUrl}${this.myApiUrl}next-team`,
      data
    );
  }

  async getHintTC(gameId: string, hintNumber: number) {
    try {
      const data = await this.getHint(gameId, hintNumber).toPromise();
      return data;
    } catch (error) {
      return undefined;
    }
  }

  getHint(gameId: string, hintNumber: number): Observable<HintResponse> {
    const data = { gameId, hintNumber };
    return this.http.post<HintResponse>(
      `${this.myAppUrl}${this.myApiUrl}hint`,
      data
    );
  }
  
  async getAllTeamsTC(gameId: string) {
    try {
      const data = await this.getAllTeams(gameId).toPromise();
      return data;
    } catch (error) {
      return undefined;
    }
  }

  getAllTeams(gameId: string): Observable<{teams: any[]}> {
    const data = { gameId };
    return this.http.post<{teams: any[]}>(
      `${this.myAppUrl}${this.myApiUrl}all-teams`,
      data
    );
  }
  
  async getDriverInfoTC(gameId: string) {
    try {
      const data = await this.getDriverInfo(gameId).toPromise();
      return data;
    } catch (error) {
      return undefined;
    }
  }

  getDriverInfo(gameId: string): Observable<{driver: any}> {
    const data = { gameId };
    return this.http.post<{driver: any}>(
      `${this.myAppUrl}${this.myApiUrl}driver-info`,
      data
    );
  }
}