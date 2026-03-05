import { TestBed } from '@angular/core/testing';

import { ImpostorService } from './impostor.service';

describe('ImpostorService', () => {
  let service: ImpostorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImpostorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
