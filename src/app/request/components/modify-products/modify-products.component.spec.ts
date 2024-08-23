import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyProductsComponent } from './modify-products.component';

describe('ModifyProductsComponent', () => {
  let component: ModifyProductsComponent;
  let fixture: ComponentFixture<ModifyProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifyProductsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModifyProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
