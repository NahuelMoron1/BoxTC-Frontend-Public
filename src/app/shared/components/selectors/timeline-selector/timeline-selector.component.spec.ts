import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineSelectorComponent } from './timeline-selector.component';

describe('TimelineSelectorComponent', () => {
  let component: TimelineSelectorComponent;
  let fixture: ComponentFixture<TimelineSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimelineSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimelineSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
