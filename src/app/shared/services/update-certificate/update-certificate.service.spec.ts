import { TestBed } from '@angular/core/testing';

import { UpdateCertificateService } from './update-certificate.service';

describe('UpdateCertificateService', () => {
  let service: UpdateCertificateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateCertificateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
