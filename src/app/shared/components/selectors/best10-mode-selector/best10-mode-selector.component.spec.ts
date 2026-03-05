import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Best10ModeSelectorComponent } from './best10-mode-selector.component';

describe('Best10ModeSelectorComponent', () => {
  let component: Best10ModeSelectorComponent;
  let fixture: ComponentFixture<Best10ModeSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Best10ModeSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Best10ModeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
