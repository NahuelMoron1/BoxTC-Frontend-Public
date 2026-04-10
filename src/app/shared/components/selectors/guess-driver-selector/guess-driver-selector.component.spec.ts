import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuessDriverSelectorComponent } from './guess-driver-selector.component';

describe('GuessDriverSelectorComponent', () => {
  let component: GuessDriverSelectorComponent;
  let fixture: ComponentFixture<GuessDriverSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuessDriverSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuessDriverSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
