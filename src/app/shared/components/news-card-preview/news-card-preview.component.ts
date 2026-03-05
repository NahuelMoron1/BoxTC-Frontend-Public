import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { News } from '../../models/News';

@Component({
  selector: 'app-news-card-preview',
  standalone: true,
  imports: [NgIf],
  templateUrl: './news-card-preview.component.html',
  styleUrl: './news-card-preview.component.css',
})
export class NewsCardPreviewComponent {
  @Input() article!: News;
  @Input() file: File | null = null;
  selectedFile: any;
  articleForm: any;

  getImagePreview(): string {
    return this.selectedFile
      ? URL.createObjectURL(this.selectedFile)
      : 'placeholder.jpg';
  }
}
