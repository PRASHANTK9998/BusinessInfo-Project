import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessAdminDashboardComponent } from './business-admin-dashboard.component';

describe('BusinessAdminDashboardComponent', () => {
  let component: BusinessAdminDashboardComponent;
  let fixture: ComponentFixture<BusinessAdminDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessAdminDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessAdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
