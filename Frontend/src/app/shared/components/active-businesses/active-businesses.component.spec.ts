import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveBusinessesComponent } from './active-businesses.component';

describe('ActiveBusinessesComponent', () => {
  let component: ActiveBusinessesComponent;
  let fixture: ComponentFixture<ActiveBusinessesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveBusinessesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveBusinessesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
