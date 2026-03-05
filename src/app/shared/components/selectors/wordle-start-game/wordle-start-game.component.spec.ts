import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordleStartGameComponent } from './wordle-start-game.component';

describe('WordleStartGameComponent', () => {
  let component: WordleStartGameComponent;
  let fixture: ComponentFixture<WordleStartGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordleStartGameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WordleStartGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
