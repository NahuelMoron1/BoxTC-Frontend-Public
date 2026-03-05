import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserRole } from '../../models/enums/UserRole';
import { User } from '../../models/User';
import { AuthRedirectService } from '../../services/auth-redirect.service';
import { ErrorService } from '../../services/error.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private userService = inject(UserService);
  private errorService = inject(ErrorService);
  private redirectService = inject(AuthRedirectService);
  private router = inject(Router);

  public user: User = new User('', '', '', '', '', UserRole.CLIENT);
  public passwordType = 'password';

  async login() {
    const emailInp = document.getElementById('emailInp') as HTMLInputElement;
    const passwordInp = document.getElementById(
      'passwordInp'
    ) as HTMLInputElement;
    let email = '';
    let password = '';
    if (!emailInp || !passwordInp) {
      return this.errorService.handleError(
        undefined,
        'No todos los campos contienen un valor'
      );
    }
    email = emailInp.value;
    password = passwordInp.value;
    try {
      const access = await this.userService.login(email, password).toPromise();
      if (access) {
        window.location.href = this.redirectService.getRedirectUrl() || '/';
      }
    } catch (error: any) {
      const fullUrl = `${window.location.origin}${this.router.url}`;
      const payload = {
        err: error,
        rawMessage: 'No se pudo iniciar sesión',
        userID: this.user?.id,
        url: fullUrl,
      };

      this.errorService.handleError(
        error,
        'No se pudo iniciar sesión',
        payload
      );
    }
  }

  togglePassword() {
    if (this.passwordType === 'password') {
      this.passwordType = 'text';
    } else {
      this.passwordType = 'password';
    }
  }
}
