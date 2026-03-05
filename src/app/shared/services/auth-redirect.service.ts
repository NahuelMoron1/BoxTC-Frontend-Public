import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthRedirectService {
  private redirectUrl: string | null = null;

  setRedirectUrl(url: string) {
    this.redirectUrl = url;
  }

  getRedirectUrl(): string | null {
    const url = this.redirectUrl;
    this.redirectUrl = null; // limpiar una vez usada
    return url;
  }
}
