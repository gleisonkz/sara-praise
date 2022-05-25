import { InjectionToken } from '@angular/core';
import { Router } from '@angular/router';

export class MinistryIdParamNotFoundError extends Error {
  constructor() {
    super('Ministry ID parameter was not found in the route.');
  }
}

const MINISTRY_ID_EXPRESSION = /\/ministerios\/(\d+)\//;
export const MINISTRY_ID = new InjectionToken<number>('MINISTRY_ID');

const ministryIdFactory = (router: Router) => {
  const fullUrl = router.url;
  const match = fullUrl.match(MINISTRY_ID_EXPRESSION);
  if (!match) throw new MinistryIdParamNotFoundError();

  return +match[1];
};

export const MINISTRY_ID_PROVIDER = {
  provide: MINISTRY_ID,
  useFactory: ministryIdFactory,
  deps: [Router],
};
