import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessDataTableComponent } from './business-data-table.component';

describe('BusinessDataTableComponent', () => {
  let component: BusinessDataTableComponent;
  let fixture: ComponentFixture<BusinessDataTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessDataTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessDataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
