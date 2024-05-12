import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { versionSystemGuard } from './version-system.guard';

describe('versionSystemGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => versionSystemGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
