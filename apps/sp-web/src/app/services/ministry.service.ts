import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { MinistryListItemRequest, MinistryListItemResponse } from '@sp/shared-interfaces';

import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MinistryService {
  private ministryListItems$$ = new BehaviorSubject<MinistryListItemResponse[]>([]);
  private readonly BASE_URL = '/api/ministry';

  constructor(private readonly http: HttpClient) {}

  ministryListItems$ = this.ministryListItems$$.asObservable();

  getMinistryListItems(ministryID?: number): Observable<MinistryListItemResponse[]> {
    const idParamPath = ministryID ? `/${ministryID}` : '';
    const url = `${this.BASE_URL}/list-item${idParamPath}`;

    return this.http
      .get<MinistryListItemResponse[]>(url)
      .pipe(tap((ministryListItems) => this.ministryListItems$$.next(ministryListItems)));
  }
}
