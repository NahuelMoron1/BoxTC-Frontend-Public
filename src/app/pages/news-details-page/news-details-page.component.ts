import { Component } from '@angular/core';
import { NavBarComponent } from '../../shared/components/nav-bar/nav-bar.component';
import { NewsDetailsComponent } from '../../shared/components/news/news-details/news-details.component';

@Component({
  selector: 'app-news-details-page',
  standalone: true,
  imports: [NavBarComponent, NewsDetailsComponent],
  templateUrl: './news-details-page.component.html',
  styleUrl: './news-details-page.component.css',
})
export class NewsDetailsPageComponent {}
