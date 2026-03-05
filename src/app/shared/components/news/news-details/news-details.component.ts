import { CommonModule, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { News } from '../../../models/News';
import { NewsService } from '../../../services/news.service';
import { NewsComponent } from '../news.component';

@Component({
  selector: 'app-news-details',
  standalone: true,
  imports: [NgIf, CommonModule, NewsComponent],
  templateUrl: './news-details.component.html',
  styleUrl: './news-details.component.css',
})
export class NewsDetailsComponent implements OnInit {
  private newsService = inject(NewsService);
  private route = inject(ActivatedRoute);
  private bffUrl?: string = environment.endpoint;
  private articleId = this.route.snapshot.paramMap.get('id');
  public article?: News;

  async ngOnInit() {
    if (!this.articleId) {
      return;
    }
    this.article = await this.newsService.getArticleTC(this.articleId);
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
}
