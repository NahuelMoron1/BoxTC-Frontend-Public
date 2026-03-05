import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectGameMenuComponent } from './select-game-menu.component';

describe('SelectGameMenuComponent', () => {
  let component: SelectGameMenuComponent;
  let fixture: ComponentFixture<SelectGameMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectGameMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectGameMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
