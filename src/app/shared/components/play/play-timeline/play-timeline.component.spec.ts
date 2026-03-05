import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayTimelineComponent } from './play-timeline.component';

describe('PlayTimelineComponent', () => {
  let component: PlayTimelineComponent;
  let fixture: ComponentFixture<PlayTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayTimelineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
