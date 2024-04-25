import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { noSessionGuard } from './no-session.guard';

describe('noSessionGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => noSessionGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
