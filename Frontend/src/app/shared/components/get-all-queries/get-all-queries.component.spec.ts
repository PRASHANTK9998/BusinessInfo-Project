import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetAllQueriesComponent } from './get-all-queries.component';

describe('GetAllQueriesComponent', () => {
  let component: GetAllQueriesComponent;
  let fixture: ComponentFixture<GetAllQueriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetAllQueriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetAllQueriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
