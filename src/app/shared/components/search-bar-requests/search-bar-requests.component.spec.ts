import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBarRequestsComponent } from './search-bar-requests.component';

describe('SearchBarRequestsComponent', () => {
  let component: SearchBarRequestsComponent;
  let fixture: ComponentFixture<SearchBarRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchBarRequestsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchBarRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
