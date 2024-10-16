import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerCityPerCategoryComponent } from './per-city-per-category.component';

describe('PerCityPerCategoryComponent', () => {
  let component: PerCityPerCategoryComponent;
  let fixture: ComponentFixture<PerCityPerCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerCityPerCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerCityPerCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
