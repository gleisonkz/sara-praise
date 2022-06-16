import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

export class RouteParamNotFoundError extends Error {
  constructor() {
    super('Route parameter was not found in the route.');
  }
}

export function injectRouteParam<T extends string | number = number>(paramName: string): T {
  const param = inject(ActivatedRoute).snapshot.params[paramName];
  const isNumber = !isNaN(+param);
  const parsedParam = isNumber ? +param : param;
  if (!param) throw new RouteParamNotFoundError();

  return parsedParam as T;
}

export function injectOptionalRouteParam<T extends string | number = number>(paramName: string): T | undefined {
  const param = inject(ActivatedRoute).snapshot.params[paramName];
  const isNumber = !isNaN(+param);
  const parsedParam = isNumber ? +param : param;
  return parsedParam as T;
}
