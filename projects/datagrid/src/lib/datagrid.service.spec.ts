import { TestBed } from '@angular/core/testing';

import { DatagridService } from './datagrid.service';

describe('DatagridService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DatagridService = TestBed.get(DatagridService);
    expect(service).toBeTruthy();
  });
});
