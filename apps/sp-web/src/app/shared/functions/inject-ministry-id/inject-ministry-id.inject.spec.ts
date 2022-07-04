import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { instance, mock, when } from 'ts-mockito';
import { injectMinistryID, MinistryIdParamNotFoundError } from './inject-ministry-id.inject';

@Component({
  template: '',
})
class TestComponent {
  ministryID;

  constructor() {
    this.ministryID = injectMinistryID();
  }
}

describe('[DI Function] - injectMinistryID', () => {
  let mockRouter: Router;
  const VALID_URL = 'http://localhost:4200/ministerios/2/tonalidades';
  const INVALID_URL = 'http://localhost:4200/ministerios/tonalidades';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{ provide: Router, useFactory: () => instance(mockRouter) }],
    }).compileComponents();
  });

  beforeEach(() => {
    mockRouter = mock(Router);
    when(mockRouter.url).thenReturn(VALID_URL);
  });

  it('should return the correct ministry ID', () => {
    const component = TestBed.createComponent(TestComponent).componentInstance;
    expect(component.ministryID).toEqual(2);
  });

  it('should throw an error if the ministry ID is not found', () => {
    when(mockRouter.url).thenReturn(INVALID_URL);
    expect(() => TestBed.createComponent(TestComponent)).toThrowError(MinistryIdParamNotFoundError);
  });
});
