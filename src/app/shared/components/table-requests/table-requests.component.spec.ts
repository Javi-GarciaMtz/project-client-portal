import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableRequestsComponent } from './table-requests.component';

describe('TableRequestsComponent', () => {
  let component: TableRequestsComponent;
  let fixture: ComponentFixture<TableRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableRequestsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TableRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
