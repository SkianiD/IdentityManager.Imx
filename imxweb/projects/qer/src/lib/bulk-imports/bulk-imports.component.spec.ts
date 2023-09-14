import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkImportsComponent } from './bulk-imports.component';

describe('BulkImportsComponent', () => {
  let component: BulkImportsComponent;
  let fixture: ComponentFixture<BulkImportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkImportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkImportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
