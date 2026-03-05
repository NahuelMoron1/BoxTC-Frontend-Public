import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BestTensComponent } from './best-tens.component';

describe('BestTensComponent', () => {
  let component: BestTensComponent;
  let fixture: ComponentFixture<BestTensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BestTensComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BestTensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
