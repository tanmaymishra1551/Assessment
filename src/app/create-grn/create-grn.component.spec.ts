import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrnStepperComponent } from './create-grn.component';

describe('GrnStepperComponent', () => {
  let component: GrnStepperComponent;
  let fixture: ComponentFixture<GrnStepperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GrnStepperComponent]
    });
    fixture = TestBed.createComponent(GrnStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
