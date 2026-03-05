import { ComponentFixture, TestBed } from '@angular/core/testing';

import { H2hGameComponent } from './h2h-game.component';

describe('H2hGameComponent', () => {
  let component: H2hGameComponent;
  let fixture: ComponentFixture<H2hGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [H2hGameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(H2hGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
