import { NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { v4 as UUIDV4 } from 'uuid';
import { News } from '../../models/News';
import { NewsService } from '../../services/news.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-create-article',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgIf],
  templateUrl: './create-article.component.html',
  styleUrl: './create-article.component.css',
})
export class CreateArticleComponent implements OnInit {
  private newsService = inject(NewsService);
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private userID?: string;
  article: News = new News('', '', '', '', '', '', '', '', false);
  imagePreview: string | null = null;
  selectedFile: File | null = null;
  articleSaved = false;

  async ngOnInit() {
    this.route.paramMap
      .pipe(map((params) => params.get('userID')))
      .subscribe((id) => {
        this.userID = id || undefined;
      });

    const isValid = await this.validateUserID();

    if (!isValid) {
      window.location.href = '';
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

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
      this.imagePreview = URL.createObjectURL(this.selectedFile);
    }
  }

  async submitArticle() {
    try {
      this.article.id = UUIDV4();
      this.article.temporaryFile = this.selectedFile;
      await this.newsService.createArticle(this.article).toPromise();
      this.articleSaved = true;
    } catch (error) {
      alert('❌ Error creating article');
    }
  }

  createAnotherArticle() {
    this.article = new News('', '', '', '', '', '', '', '', false);
    this.selectedFile = null;
    this.imagePreview = null;
    this.articleSaved = false;
    location.reload;
  }
  goToEdit() {
    window.location.href = `/edit-article/${this.article.id}`;
  }
}
