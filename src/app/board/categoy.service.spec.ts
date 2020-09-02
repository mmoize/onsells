import { TestBed } from '@angular/core/testing';

import { CategoyService } from './categoy.service';

describe('CategoyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CategoyService = TestBed.get(CategoyService);
    expect(service).toBeTruthy();
  });
});
