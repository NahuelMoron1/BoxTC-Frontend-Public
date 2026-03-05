import { TestBed } from '@angular/core/testing';

import { GuessTeamService } from './guess-team.service';

describe('GuessTeamService', () => {
  let service: GuessTeamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GuessTeamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
