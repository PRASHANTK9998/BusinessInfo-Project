import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetLowprofilescoreComponent } from './get-lowprofilescore.component';

describe('GetLowprofilescoreComponent', () => {
  let component: GetLowprofilescoreComponent;
  let fixture: ComponentFixture<GetLowprofilescoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetLowprofilescoreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetLowprofilescoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
