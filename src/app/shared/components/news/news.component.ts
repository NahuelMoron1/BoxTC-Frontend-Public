import { NgFor, NgIf } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { News } from '../../models/News';
import { NewsService } from '../../services/news.service';
import { UserService } from '../../services/user.service';
import { ContributorsComponent } from './contributors/contributors.component';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [NgIf, NgFor, RouterLink, ContributorsComponent],
  templateUrl: './news.component.html',
  styleUrl: './news.component.css',
})
export class NewsComponent implements OnInit {
  @Input() userID?: string;

  private userService = inject(UserService);
  private newsService = inject(NewsService);
  private router = inject(Router);

  private bffUrl?: string = environment.endpoint;
  public articles?: News[];

  async ngOnInit() {
    const isValid = this.onMyArticles() && (await this.validateUserID());

    if (isValid && this.userID) {
      this.articles = await this.newsService.getMyNewsTC(this.userID);
      return;
    }

    this.articles = (await this.newsService.getAllNewsTC()) || [];
  }

  onMyArticles() {
    const url = this.router.url;
    if (url.includes('my-articles')) {
      return true;
    }
    return false;
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

  getImage(imageUrl: string) {
    if (!this.bffUrl) {
      return '';
    }
    return this.bffUrl + imageUrl;
  }
  formatCustomDate(input: string): string {
    const [year, day, month] = input.split('-');
    const date = new Date(Number(year), Number(month) - 1, Number(day)); // mes empieza en 0

    return date
      .toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      })
      .replace(',', ',');
  }
  editArticle() {
    alert('HI');
  }
}
