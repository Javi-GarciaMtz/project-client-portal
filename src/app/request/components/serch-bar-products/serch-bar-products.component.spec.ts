import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerchBarProductsComponent } from './serch-bar-products.component';

describe('SerchBarProductsComponent', () => {
  let component: SerchBarProductsComponent;
  let fixture: ComponentFixture<SerchBarProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SerchBarProductsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SerchBarProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
