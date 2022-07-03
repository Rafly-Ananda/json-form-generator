import { TestBed } from '@angular/core/testing';

import { UiSchemaService } from './ui-schema.service';

describe('UiSchemaService', () => {
  let service: UiSchemaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UiSchemaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
