import { TestBed } from '@angular/core/testing';

import { GuessCareersService } from './guess-careers.service';

describe('GuessCareersService', () => {
  let service: GuessCareersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GuessCareersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
