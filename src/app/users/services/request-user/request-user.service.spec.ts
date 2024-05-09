import { TestBed } from '@angular/core/testing';

import { RequestUserService } from './request-user.service';

describe('RequestUserService', () => {
  let service: RequestUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
