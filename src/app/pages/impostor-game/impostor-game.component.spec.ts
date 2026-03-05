import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpostorGameComponent } from './impostor-game.component';

describe('ImpostorGameComponent', () => {
  let component: ImpostorGameComponent;
  let fixture: ComponentFixture<ImpostorGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImpostorGameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImpostorGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
