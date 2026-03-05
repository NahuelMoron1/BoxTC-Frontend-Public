import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserStatus } from '../../models/enums/UserStatus';
import { User } from '../../models/User';
import { CookieService } from '../../services/cookie.service';
import { FollowUsComponent } from '../follow-us/follow-us.component';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterLink, CommonModule, FollowUsComponent],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent implements OnInit {
  private cookieService = inject(CookieService);
  public user?: User;

  async ngOnInit() {
    this.user = await this.cookieService.getTokenTC('access_token');
  }
  goToCreate() {
    if (this.user?.status === UserStatus.ACTIVE) {
      window.location.href = `/create-article/${this.user.id}`;
    }
  }
}
