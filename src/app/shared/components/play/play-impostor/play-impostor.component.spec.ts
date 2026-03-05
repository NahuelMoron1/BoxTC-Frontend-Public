import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayImpostorComponent } from './play-impostor.component';

describe('PlayImpostorComponent', () => {
  let component: PlayImpostorComponent;
  let fixture: ComponentFixture<PlayImpostorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayImpostorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayImpostorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
