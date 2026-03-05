import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionsModeSelectorComponent } from './connections-mode-selector.component';

describe('ConnectionsModeSelectorComponent', () => {
  let component: ConnectionsModeSelectorComponent;
  let fixture: ComponentFixture<ConnectionsModeSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectionsModeSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectionsModeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
