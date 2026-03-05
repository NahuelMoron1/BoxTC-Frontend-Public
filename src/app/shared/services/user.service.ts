import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/User';
import { CookieService } from './cookie.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private myAppUrl: string;
  private myApiUrl: string;
  private http = inject(HttpClient);
  public user?: User;

  cookieService = inject(CookieService);
  constructor() {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/users/';
  }

  async validateUserIDTC(userID: string) {
    try {
      const isValid = await this.validateUserID(userID).toPromise();
      return isValid;
    } catch (error: any) {
      return false;
    }
  }

  validateUserID(userID: string): Observable<boolean> {
    const urlAux = this.myAppUrl + this.myApiUrl + `validate/user/${userID}`;

    return this.http.get<boolean>(urlAux, {
      withCredentials: true,
    });
  }

  ///READ USER LOGGED

  async getUserLogged() {
    (await this.cookieService.getUser()).subscribe((data) => {
      this.user = data;
    });
    return this.user;
  }

  ///LOGIN

  async readLogin(email: string, password: string) {
    const userAux = await this.loginTC(email, password);
    if (userAux != null) {
      localStorage.setItem('userLogged', JSON.stringify(userAux)); //Se guarda en local storage una copia del usuario que se loguea, para saber que está logueado en cualquier parte de la pagina
      return true;
    } else {
      return false;
    }
  }

  async loginTC(email: string, password: string) {
    try {
      const userAux = await this.login(email, password).toPromise();
      if (userAux) {
        return userAux;
      } else {
        return null;
      }
    } catch (error: any) {
      if (error.status === 404 && error.error?.message) {
        console.error(error.error.message); // Accediendo al mensaje del backend
      } else {
        console.error('Error desconocido', error);
      }
      return null;
    }
  }

  login(email: string, password: string): Observable<User> {
    const userdata = {
      email,
      password,
    };
    const urlAux = this.myAppUrl + this.myApiUrl + 'login';

    return this.http.post<User>(urlAux, userdata, {
      withCredentials: true, // Esto permite que las cookies se envíen y se reciban
    });
  }

  ///LOGOUT

  async logoutTC() {
    /// TRY CATCH CAllS LOGOUT();
    try {
      const access = await this.logout().toPromise();
      return access;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error obteniendo datos:', error.message);
      }
      return false;
    }
  }

  logout(): Observable<void> {
    const urlAux = this.myAppUrl + this.myApiUrl + 'logout';
    return this.http.post<void>(urlAux, '', { withCredentials: true });
  }
}
