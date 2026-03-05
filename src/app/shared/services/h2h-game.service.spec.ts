import { TestBed } from '@angular/core/testing';

import { H2hGameService } from './h2h-game.service';

describe('H2hGameService', () => {
  let service: H2hGameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(H2hGameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
