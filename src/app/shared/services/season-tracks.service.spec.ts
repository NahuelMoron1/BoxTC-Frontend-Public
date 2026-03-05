import { TestBed } from '@angular/core/testing';

import { SeasonTracksService } from './season-tracks.service';

describe('SeasonTracksService', () => {
  let service: SeasonTracksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeasonTracksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
