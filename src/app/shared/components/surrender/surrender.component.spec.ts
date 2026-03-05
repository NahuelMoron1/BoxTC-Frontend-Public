import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurrenderComponent } from './surrender.component';

describe('SurrenderComponent', () => {
  let component: SurrenderComponent;
  let fixture: ComponentFixture<SurrenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurrenderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurrenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
