import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayH2hComponent } from './play-h2h.component';

describe('PlayH2hComponent', () => {
  let component: PlayH2hComponent;
  let fixture: ComponentFixture<PlayH2hComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayH2hComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayH2hComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
