import { Injectable } from '@angular/core';
import { SkyToastService, SkyToastType } from '@skyux/toast';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  public static openToast(
    toastService: SkyToastService,
    text: string,
    toastType: SkyToastType
  ) {
    const toastSeconds = 4;
    const instance = toastService.openMessage(text, { type: toastType });

    // close toast after a few seconds
    setTimeout(() => instance.close(), toastSeconds * 1000);
  }

  public static errorText(err: any) {
    if (!err) {
      return '';
    }

    // Handle network errors (statusCode === 0 or ProgressEvent)
    if (err.status === 0) {
      // Check if the error is a ProgressEvent
      if (err.error instanceof ProgressEvent) {
        return 'Network error: Unable to reach the server. Please check your internet connection or server availability.';
      }

      return 'Unknown error occurred (status 0). Possible network issue.';
    }

    if (err && err.status) {
      const status = err.status ? err.status : '';
      const statusText = err.error.message ? err.error.message : '';
      return `${status} - ${statusText}`;
    }

    if (typeof err === 'string') {
      return err;
    }

    return UtilsService.safeStringify(err);
  }

  public static safeStringify(err: any) {
    try {
      return JSON.stringify(err);
    } catch (ex) {
      return JSON.stringify(ex);
    }
  }

  public static generateRandomId(length = 16): string {
    //Genera un codigo random de 16 caracteres y lo devuelve. Sirve para los ID
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  public static isValidInput(input: string) {
    const regex = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s@]*$/;
    return regex.test(input);
  }
}
