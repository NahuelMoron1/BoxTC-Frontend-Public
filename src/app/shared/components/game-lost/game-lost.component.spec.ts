import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameLostComponent } from './game-lost.component';

describe('GameLostComponent', () => {
  let component: GameLostComponent;
  let fixture: ComponentFixture<GameLostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameLostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameLostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
