import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuessCareersPageComponent } from './guess-careers-page.component';

describe('GuessCareersPageComponent', () => {
  let component: GuessCareersPageComponent;
  let fixture: ComponentFixture<GuessCareersPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuessCareersPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuessCareersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
