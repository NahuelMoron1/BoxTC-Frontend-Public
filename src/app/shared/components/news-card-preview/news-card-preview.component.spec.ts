import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsCardPreviewComponent } from './news-card-preview.component';

describe('NewsCardPreviewComponent', () => {
  let component: NewsCardPreviewComponent;
  let fixture: ComponentFixture<NewsCardPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsCardPreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsCardPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
