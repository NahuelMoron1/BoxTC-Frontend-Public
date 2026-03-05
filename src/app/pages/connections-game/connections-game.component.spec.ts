import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionsGameComponent } from './connections-game.component';

describe('ConnectionsGameComponent', () => {
  let component: ConnectionsGameComponent;
  let fixture: ComponentFixture<ConnectionsGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectionsGameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectionsGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
