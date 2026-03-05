import { TestBed } from '@angular/core/testing';

import { BestTensService } from './best-tens.service';

describe('BestTensService', () => {
  let service: BestTensService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BestTensService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
