import { TestBed } from '@angular/core/testing';

import { SeasonTeamsService } from './season-teams.service';

describe('SeasonTeamsService', () => {
  let service: SeasonTeamsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeasonTeamsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
