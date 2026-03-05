import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordleDataComponent } from './wordle-data.component';

describe('WordleDataComponent', () => {
  let component: WordleDataComponent;
  let fixture: ComponentFixture<WordleDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordleDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WordleDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
