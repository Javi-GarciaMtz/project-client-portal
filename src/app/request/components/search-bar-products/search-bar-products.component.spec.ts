import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBarProductsComponent } from './search-bar-products.component';

describe('SearchBarProductsComponent', () => {
  let component: SearchBarProductsComponent;
  let fixture: ComponentFixture<SearchBarProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchBarProductsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchBarProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
