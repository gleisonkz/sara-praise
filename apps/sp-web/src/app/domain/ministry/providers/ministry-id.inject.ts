import { inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

export class MinistryIdParamNotFoundError extends Error {
  constructor() {
    super('Ministry ID parameter was not found in the route.');
  }
}

const MINISTRY_ID_EXPRESSION = /\/ministerios\/(\d+)\//;

export function injectMinistryID(): number {
  const fullUrl = inject(Router);
  const match = fullUrl.url.match(MINISTRY_ID_EXPRESSION);
  if (!match) throw new MinistryIdParamNotFoundError();
  return +match[1];
}

export function injectRouteParam(paramName: string): number {
  return +inject(ActivatedRoute).snapshot.params[paramName];
}
