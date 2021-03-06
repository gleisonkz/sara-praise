import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class MinistryDetailRouteService {
  getMinistryID(activatedRoute: ActivatedRoute): number {
    const parentActivatedRoute = activatedRoute.parent;
    if (!parentActivatedRoute) throw new Error('parentActivatedRoute is undefined');

    const { ministryID } = parentActivatedRoute.snapshot.params;
    return +ministryID;
  }
}
