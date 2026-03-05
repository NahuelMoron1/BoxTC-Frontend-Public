import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { NavBarComponent } from '../../shared/components/nav-bar/nav-bar.component';
import { NewsComponent } from '../../shared/components/news/news.component';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-my-articles-page',
  imports: [NewsComponent, CommonModule, NavBarComponent],
  templateUrl: './my-articles-page.component.html',
  styleUrl: './my-articles-page.component.css',
})
export class MyArticlesPageComponent implements OnInit {
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  public userID?: string;

  async ngOnInit() {
    this.route.paramMap
      .pipe(map((params) => params.get('userID')))
      .subscribe((id) => {
        this.userID = id || undefined;
      });

    const isValid = await this.validateUserID();

    if (!isValid) {
      this.userID = undefined;
    }
  }

  async validateUserID() {
    const user = await this.userService.getUserLogged();

    if (!user || !this.userID) {
      return false;
    }
    if (user.id !== this.userID) {
      return false;
    }

    const isValid = await this.userService.validateUserIDTC(this.userID);

    return isValid;
  }
}
