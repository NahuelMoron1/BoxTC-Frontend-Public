import { inject, Injectable } from '@angular/core';
import { SkyToastService, SkyToastType } from '@skyux/toast';
import { SlackService } from './slack.service';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  public toastSvc = inject(SkyToastService);

  public static errorText(err: any) {
    return UtilsService.errorText(err);
  }

  public handleError(err: any, message: string, payload?: any) {
    let errMessage = `${message}`;
    if (err) {
      errMessage += `- ${UtilsService.errorText(err)}`;
    }

    UtilsService.openToast(this.toastSvc, errMessage, SkyToastType.Danger);

    if (!payload) {
      return;
    }

    const postError = ErrorService.postError(err.error.message);

    if (postError) {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      SlackService.postErrorNotification(payload).subscribe(() => {});
    }
  }

  public static postError(err: any) {
    if (!err) {
      return false;
    }

    /*const is403 = err?.status === 403;
    if (is403) {
      return false;
    }

    const is404 = err?.status === 404;
    if (is404) {
      return false;
    }

    const is500 = err?.status === 500;
    if (is500) {
      // these are logged in devops, no need to post ui error
      return false;
    }

    if (!err?.status) {
      // don't post error for timeouts
      return false;
    }*/

    const errText = ErrorService.errorText(err);
    const suppressErrorMsg = ErrorService.suppressErrorMessage(errText);
    if (suppressErrorMsg) {
      return false;
    }

    return true;
  }

  private static suppressErrorMessage(msg: string) {
    // suppress these error messages, they are usually 400s from the server that we can safely ignore
    const ignoreMessages = [
      'Not found',
    ];

    if (ignoreMessages.includes(msg)) {
      return true;
    }

    const regexIgnorePatterns = [
      /No se encontró \w+\./,
      /No se encontraron \w+\./,
    ];

    // Check for regex pattern match
    return regexIgnorePatterns.some((regex) => regex.test(msg));
  }
}
