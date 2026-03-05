import { ComponentFixture, TestBed } from '@angular/core/testing';

import { H2hTeamInfoComponent } from './h2h-team-info.component';

describe('H2hTeamInfoComponent', () => {
  let component: H2hTeamInfoComponent;
  let fixture: ComponentFixture<H2hTeamInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [H2hTeamInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(H2hTeamInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
