import { TestBed } from '@angular/core/testing';

import { BulkImportsService } from './bulk-imports.service';

describe('BulkImportsService', () => {
  let service: BulkImportsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BulkImportsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
