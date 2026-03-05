import { ComponentFixture, TestBed } from '@angular/core/testing';

import { H2hModeSelectorComponent } from './h2h-mode-selector.component';

describe('H2hModeSelectorComponent', () => {
  let component: H2hModeSelectorComponent;
  let fixture: ComponentFixture<H2hModeSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [H2hModeSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(H2hModeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
