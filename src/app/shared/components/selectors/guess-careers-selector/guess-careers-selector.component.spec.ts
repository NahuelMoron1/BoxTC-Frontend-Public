import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuessCareersSelectorComponent } from './guess-careers-selector.component';

describe('GuessCareersSelectorComponent', () => {
  let component: GuessCareersSelectorComponent;
  let fixture: ComponentFixture<GuessCareersSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuessCareersSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuessCareersSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
