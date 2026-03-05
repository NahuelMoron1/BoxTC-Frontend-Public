import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { News } from '../models/News';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private myAppUrl: string;
  private myApiUrl: string;
  private http = inject(HttpClient);

  constructor() {
    this.myAppUrl = environment.endpoint;
    this.myApiUrl = 'api/news/';
  }

  createArticle(articleData: News): Observable<void> {
    const formData = new FormData();
    formData.append('body', JSON.stringify(articleData));

    if (articleData.temporaryFile) {
      formData.append('file', articleData.temporaryFile);
    }
    return this.http.post<void>(
      `${this.myAppUrl}${this.myApiUrl}create`,
      formData,
      {
        withCredentials: true,
      }
    );
  }

  editArticle(articleData: News): Observable<void> {
    const formData = new FormData();
    formData.append('body', JSON.stringify(articleData));

    if (articleData.temporaryFile) {
      formData.append('file', articleData.temporaryFile);
    }
    return this.http.post<void>(
      `${this.myAppUrl}${this.myApiUrl}edit`,
      formData,
      {
        withCredentials: true,
      }
    );
  }

  async getMyNewsTC(userID: string) {
    try {
      const data = await this.getMyNews(userID).toPromise();
      return data;
    } catch (error) {
      return undefined;
    }
  }

  getMyNews(userID: string): Observable<News[]> {
    return this.http.get<News[]>(
      `${this.myAppUrl}${this.myApiUrl}news/${userID}`,
      { withCredentials: true }
    );
  }

  async getAllNewsTC() {
    try {
      const data = await this.getAllNews().toPromise();
      return data;
    } catch (error) {
      return undefined;
    }
  }

  getAllNews(): Observable<News[]> {
    return this.http.get<News[]>(`${this.myAppUrl}${this.myApiUrl}news`);
  }

  async getArticleTC(id: string, allowed?: boolean) {
    try {
      const data = await this.getArticle(id, allowed).toPromise();
      return data;
    } catch (error) {
      return undefined;
    }
  }

  getArticle(id: string, allowed?: boolean): Observable<News> {
    if (!allowed) {
      allowed = false;
    }
    return this.http.get<News>(
      `${this.myAppUrl}${this.myApiUrl}news/${id}/${allowed}`
    );
  }
}
