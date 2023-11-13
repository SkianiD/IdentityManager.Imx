import { TestBed } from '@angular/core/testing';

import { CsvsyncService } from './csvsync.service';

describe('CsvsyncService', () => {
  let service: CsvsyncService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CsvsyncService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
