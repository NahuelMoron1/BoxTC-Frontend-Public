import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpostorModeSelectorComponent } from './impostor-mode-selector.component';

describe('ImpostorModeSelectorComponent', () => {
  let component: ImpostorModeSelectorComponent;
  let fixture: ComponentFixture<ImpostorModeSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImpostorModeSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImpostorModeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
