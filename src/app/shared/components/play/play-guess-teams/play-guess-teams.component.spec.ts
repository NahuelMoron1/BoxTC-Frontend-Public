import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayGuessTeamsComponent } from './play-guess-teams.component';

describe('PlayGuessTeamsComponent', () => {
  let component: PlayGuessTeamsComponent;
  let fixture: ComponentFixture<PlayGuessTeamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayGuessTeamsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayGuessTeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
