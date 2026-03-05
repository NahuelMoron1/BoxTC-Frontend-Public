import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SlackService {
  private static myAppUrl: string = environment.endpoint;
  private static myApiUrl = 'api/slack/';
  private static http: HttpClient;

  // Se llama una vez en el arranque para setear el HttpClient
  static init(http: HttpClient) {
    SlackService.http = http;
  }

  public static postErrorNotification(context?: any) {
    const payload = {
      message: context.rawMessage,
      context,
    };

    return this.http.post(
      this.myAppUrl + this.myApiUrl + 'postError',
      payload,
      { withCredentials: true }
    );
  }
}
