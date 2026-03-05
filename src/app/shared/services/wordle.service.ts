import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WordleService {
  private myAppUrl: string;
  private myApiUrl: string;
  private http = inject(HttpClient);

  constructor() {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/wordle/';
  }

  async getWordTC() {
    try {
      const word = await this.getWordOfTheDay().toPromise();
      if (!word) {
        return '';
      }
      return word;
    } catch (error) {
      return '';
    }
  }

  getWordOfTheDay(): Observable<string> {
    return this.http
      .get<{ word: string }>(this.myAppUrl + this.myApiUrl + 'wordle')
      .pipe(map((res) => res.word.toLowerCase()));
  }
}
