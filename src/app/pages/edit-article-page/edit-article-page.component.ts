import { Component } from '@angular/core';
import { EditArticleComponent } from '../../shared/components/edit-article/edit-article.component';
import { NavBarComponent } from '../../shared/components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-edit-article-page',
  standalone: true,
  imports: [NavBarComponent, EditArticleComponent],
  templateUrl: './edit-article-page.component.html',
  styleUrl: './edit-article-page.component.css',
})
export class EditArticlePageComponent {}
