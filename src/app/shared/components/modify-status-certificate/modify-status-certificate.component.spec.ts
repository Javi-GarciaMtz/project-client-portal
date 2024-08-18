import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyStatusCertificateComponent } from './modify-status-certificate.component';

describe('ModifyStatusCertificateComponent', () => {
  let component: ModifyStatusCertificateComponent;
  let fixture: ComponentFixture<ModifyStatusCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifyStatusCertificateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifyStatusCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
