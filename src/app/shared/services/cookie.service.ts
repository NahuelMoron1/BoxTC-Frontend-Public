import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root',
})
export class CookieService {
  private myAppUrl: string;
  private myApiUrl: string;
  private http = inject(HttpClient);
  user?: User;
  _user: BehaviorSubject<User | undefined> = new BehaviorSubject<
    User | undefined
  >(this.user);
  isLogged = false;
  _islogged: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    this.isLogged
  );

  constructor() {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/cookie/';
  }

  returnUser() {
    return this._user.asObservable();
  }

  returnLogged() {
    return this._islogged.asObservable();
  }

  ///GET USER INFORMATION

  async getUser() {
    (await this.tokenExistTC('access_token')).subscribe((data) => {
      this.isLogged = data;
    });
    if (this.isLogged) {
      const userAux = await this.getTokenTC('access_token');
      if (userAux != null) {
        this.user = userAux;
        this._user.next(this.user);
      }
    }
    return this._user.asObservable();
  }

  async tokenExistTC(cookieName: string) {
    const tokenAux = await this.tokenExist(cookieName).toPromise();
    if (tokenAux != undefined) {
      this.isLogged = tokenAux;
      this._islogged.next(this.isLogged);
    }
    return this._islogged.asObservable();
  }

  tokenExist(cookieName: string): Observable<boolean> {
    return this.http.get<boolean>(
      this.myAppUrl + this.myApiUrl + 'check/' + cookieName,
      {
        withCredentials: true, // Esto permite que las cookies se envíen y se reciban
      }
    );
  }

  async getTokenTC(cookieName: string) {
    const data = await this.getToken(cookieName).toPromise();
    if (data) {
      return data;
    } else {
      return undefined;
    }
  }

  getToken(cookieName: string): Observable<User | null> {
    return this.http
      .get<User>(`${this.myAppUrl}${this.myApiUrl}get/${cookieName}`, {
        withCredentials: true, // Esto permite que las cookies se envíen y se reciban
      })
      .pipe(
        catchError((error) => {
          console.error(`Error al obtener el token para ${cookieName}:`, error);
          return of(null); // Retorna `null` en caso de error para manejarlo de forma segura
        })
      );
  }
}
