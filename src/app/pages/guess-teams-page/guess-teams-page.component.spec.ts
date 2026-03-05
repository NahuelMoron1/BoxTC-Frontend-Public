import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuessTeamsPageComponent } from './guess-teams-page.component';

describe('GuessTeamsPageComponent', () => {
  let component: GuessTeamsPageComponent;
  let fixture: ComponentFixture<GuessTeamsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuessTeamsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuessTeamsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
