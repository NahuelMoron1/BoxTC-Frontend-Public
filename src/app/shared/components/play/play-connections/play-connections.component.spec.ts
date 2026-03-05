import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayConnectionsComponent } from './play-connections.component';

describe('PlayConnectionsComponent', () => {
  let component: PlayConnectionsComponent;
  let fixture: ComponentFixture<PlayConnectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayConnectionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayConnectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
