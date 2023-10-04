import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationResultsDialogComponent } from './validation-results-dialog.component';

describe('ValidationResultsDialogComponent', () => {
  let component: ValidationResultsDialogComponent;
  let fixture: ComponentFixture<ValidationResultsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidationResultsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationResultsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
