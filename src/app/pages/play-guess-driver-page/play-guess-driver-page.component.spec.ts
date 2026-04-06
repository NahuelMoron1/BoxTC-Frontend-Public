import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayGuessDriverPageComponent } from './play-guess-driver-page.component';

describe('PlayGuessDriverPageComponent', () => {
  let component: PlayGuessDriverPageComponent;
  let fixture: ComponentFixture<PlayGuessDriverPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayGuessDriverPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayGuessDriverPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
