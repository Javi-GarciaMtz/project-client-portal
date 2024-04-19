import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowErrorsInFormComponent } from './show-errors-in-form.component';

describe('ShowErrorsInFormComponent', () => {
  let component: ShowErrorsInFormComponent;
  let fixture: ComponentFixture<ShowErrorsInFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShowErrorsInFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ShowErrorsInFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
