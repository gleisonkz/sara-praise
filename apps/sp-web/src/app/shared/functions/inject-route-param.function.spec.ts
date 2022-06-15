import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

import {
    injectRouteParam, RouteParamNotFoundError
} from 'apps/sp-web/src/app/shared/functions/inject-route-param.function';
import { instance, mock, when } from 'ts-mockito';

@Component({
  template: '',
})
class TestComponent {
  someID = injectRouteParam('someID');
}

describe('[DI Function] - injectRouteParam', () => {
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {
          provide: ActivatedRoute,
          useFactory: () => ({ snapshot: instance(mockActivatedRouteSnapshot) }),
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    mockActivatedRouteSnapshot = mock(ActivatedRouteSnapshot);
  });

  it('should return the correct param value as a number', () => {
    const anyParam = 'someID';
    const expectedParamValue = 123;
    when(mockActivatedRouteSnapshot.params).thenReturn({ [anyParam]: expectedParamValue.toString() });

    const component = TestBed.createComponent(TestComponent).componentInstance;
    expect(component.someID).toEqual(expectedParamValue);
  });

  it('should return the correct param value as a string', () => {
    const anyParam = 'someID';
    const expectedParamValue = 'abc';
    when(mockActivatedRouteSnapshot.params).thenReturn({ [anyParam]: expectedParamValue });

    const component = TestBed.createComponent(TestComponent).componentInstance;
    expect(component.someID).toEqual(expectedParamValue);
  });

  it('should throw an error if param is not found', () => {
    when(mockActivatedRouteSnapshot.params).thenReturn({});
    expect(() => TestBed.createComponent(TestComponent)).toThrow(RouteParamNotFoundError);
  });
});
