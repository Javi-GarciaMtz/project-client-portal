import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsModifyComponent } from './tabs-modify.component';

describe('TabsModifyComponent', () => {
  let component: TabsModifyComponent;
  let fixture: ComponentFixture<TabsModifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TabsModifyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TabsModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
