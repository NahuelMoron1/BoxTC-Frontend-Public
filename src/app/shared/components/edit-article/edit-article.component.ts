import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';
import { News } from '../../models/News';
import { NewsService } from '../../services/news.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-edit-article',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './edit-article.component.html',
  styleUrl: './edit-article.component.css',
})
export class EditArticleComponent {
  private userService = inject(UserService);
  private newsService = inject(NewsService);
  private route = inject(ActivatedRoute);
  private bffUrl?: string = environment.endpoint;

  article?: News;
  imagePreview: string | null = null;
  selectedFile: File | null = null;
  articleSaved = false;

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      await this.loadArticle(id);
      if (!this.article) {
        return;
      }
      this.fixDateFormat(this.article.date);

      const isValid = await this.validateUserID();
      if (!isValid) {
        window.location.href = '';
        return;
      }
    }
  }

  async validateUserID() {
    const user = await this.userService.getUserLogged();
    if (!user || !this.article) {
      return false;
    }
    if (user.id !== this.article.userID) {
      return false;
    }

    const isValid = await this.userService.validateUserIDTC(user.id);
    return isValid;
  }

  async loadArticle(id: string) {
    this.article = await this.newsService.getArticleTC(id, true);
    if (this.bffUrl && this.article?.image) {
      this.imagePreview = this.bffUrl + this.article?.image;
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
      this.imagePreview = URL.createObjectURL(this.selectedFile);
    }
  }

  async submitArticle() {
    try {
      if (!this.article) {
        return;
      }
      this.article.temporaryFile = this.selectedFile;
      await this.newsService.editArticle(this.article).toPromise();
      this.articleSaved = true;
    } catch (error) {
      alert('❌ Error editing article');
    }
  }

  fixDateFormat = (rawDate: string): string => {
    const [year, day, month] = rawDate.split('-');
    return `${year}-${month}-${day}`; // Devuelve en formato válido
  };

  async deleteArticle() {}
}
