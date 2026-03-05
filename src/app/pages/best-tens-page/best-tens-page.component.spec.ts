import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BestTensPageComponent } from './best-tens-page.component';

describe('BestTensPageComponent', () => {
  let component: BestTensPageComponent;
  let fixture: ComponentFixture<BestTensPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BestTensPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BestTensPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
