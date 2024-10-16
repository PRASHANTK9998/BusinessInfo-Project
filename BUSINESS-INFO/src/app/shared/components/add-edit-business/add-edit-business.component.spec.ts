import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditBusinessComponent } from './add-edit-business.component';

describe('AddEditBusinessComponent', () => {
  let component: AddEditBusinessComponent;
  let fixture: ComponentFixture<AddEditBusinessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditBusinessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
