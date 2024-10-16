import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBusinessModalComponent } from './view-business-modal.component';

describe('ViewBusinessModalComponent', () => {
  let component: ViewBusinessModalComponent;
  let fixture: ComponentFixture<ViewBusinessModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewBusinessModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewBusinessModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
