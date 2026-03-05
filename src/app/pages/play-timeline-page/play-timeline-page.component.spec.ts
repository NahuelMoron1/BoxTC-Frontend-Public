import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayTimelinePageComponent } from './play-timeline-page.component';

describe('PlayTimelinePageComponent', () => {
  let component: PlayTimelinePageComponent;
  let fixture: ComponentFixture<PlayTimelinePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayTimelinePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayTimelinePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
