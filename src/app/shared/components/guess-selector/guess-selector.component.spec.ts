import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuessSelectorComponent } from './guess-selector.component';

describe('GuessSelectorComponent', () => {
  let component: GuessSelectorComponent;
  let fixture: ComponentFixture<GuessSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuessSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuessSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
