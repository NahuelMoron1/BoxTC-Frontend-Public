import { TestBed } from '@angular/core/testing';

import { SeasonTeamsDriversService } from './season-teams-drivers.service';

describe('SeasonTeamsDriversService', () => {
  let service: SeasonTeamsDriversService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeasonTeamsDriversService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
