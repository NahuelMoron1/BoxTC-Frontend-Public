import { Component } from '@angular/core';
import { LoginComponent } from '../../shared/components/login/login.component';
import { NavBarComponent } from '../../shared/components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [NavBarComponent, LoginComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent {}
