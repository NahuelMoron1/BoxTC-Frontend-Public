import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuessCareersComponent } from './guess-careers.component';

describe('GuessCareersComponent', () => {
  let component: GuessCareersComponent;
  let fixture: ComponentFixture<GuessCareersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuessCareersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuessCareersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
