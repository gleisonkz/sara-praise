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

  createMinistryListItem(ministry: MinistryListItemRequest): Observable<MinistryListItemResponse> {
    return this.http
      .post<MinistryListItemResponse>(`${this.BASE_URL}/list-item`, ministry)
      .pipe(
        tap((ministryListItem) => this.ministryListItems$$.next([...this.ministryListItems$$.value, ministryListItem]))
      );
  }

  getMinistryListItems(ministryID?: number): Observable<MinistryListItemResponse[]> {
    const idParamPath = ministryID ? `/${ministryID}` : '';
    const url = `${this.BASE_URL}/list-item${idParamPath}`;

    return this.http
      .get<MinistryListItemResponse[]>(url)
      .pipe(tap((ministryListItems) => this.ministryListItems$$.next(ministryListItems)));
  }
}
