import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { MinistryListItemResponse } from '@sp/shared-interfaces';

import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MinistryService {
  private ministryListItems$$ = new BehaviorSubject<MinistryListItemResponse[]>([]);

  constructor(private readonly http: HttpClient) {}

  ministryListItems$ = this.ministryListItems$$.asObservable();

  getMinistryListItems(ministryID?: number): void {
    const url = `/api/ministry${ministryID ? `/${ministryID}` : ''}`;

    this.http
      .get<MinistryListItemResponse[]>(url)
      .pipe(
        tap((items) => console.log('ministryListItems', items)),
        tap((ministryListItems) => this.ministryListItems$$.next(ministryListItems))
      )
      .subscribe();
  }
}
