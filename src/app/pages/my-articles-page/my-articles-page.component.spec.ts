import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyArticlesPageComponent } from './my-articles-page.component';

describe('MyArticlesPageComponent', () => {
  let component: MyArticlesPageComponent;
  let fixture: ComponentFixture<MyArticlesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyArticlesPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyArticlesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
