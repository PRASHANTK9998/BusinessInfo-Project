import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighlyRatedCompaniesComponent } from './highly-rated-companies.component';

describe('HighlyRatedCompaniesComponent', () => {
  let component: HighlyRatedCompaniesComponent;
  let fixture: ComponentFixture<HighlyRatedCompaniesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HighlyRatedCompaniesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HighlyRatedCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
