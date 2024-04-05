import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelAdminContainerComponent } from './panel-admin-container.component';

describe('PanelAdminContainerComponent', () => {
  let component: PanelAdminContainerComponent;
  let fixture: ComponentFixture<PanelAdminContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PanelAdminContainerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PanelAdminContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
