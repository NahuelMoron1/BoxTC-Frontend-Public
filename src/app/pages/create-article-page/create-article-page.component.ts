import { Component } from '@angular/core';
import { CreateArticleComponent } from '../../shared/components/create-article/create-article.component';
import { NavBarComponent } from '../../shared/components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-create-article-page',
  standalone: true,
  imports: [NavBarComponent, CreateArticleComponent],
  templateUrl: './create-article-page.component.html',
  styleUrl: './create-article-page.component.css',
})
export class CreateArticlePageComponent {}
