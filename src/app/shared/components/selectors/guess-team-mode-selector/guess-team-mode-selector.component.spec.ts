import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuessTeamModeSelectorComponent } from './guess-team-mode-selector.component';

describe('GuessTeamModeSelectorComponent', () => {
  let component: GuessTeamModeSelectorComponent;
  let fixture: ComponentFixture<GuessTeamModeSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuessTeamModeSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuessTeamModeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
