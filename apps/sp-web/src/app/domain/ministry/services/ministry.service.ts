import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
    KeyResponse, MemberListItemResponse, MinistryKeyListItemResponse, MinistryKeyRequest,
    MinistryListItemResponse, MinistryRequest, ScaleDetailResponse, ScaleListItemResponse,
    SongListItemResponse
} from '@sp/shared-interfaces';

import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MinistryService {
  private ministryListItems$$ = new BehaviorSubject<MinistryListItemResponse[]>([]);
  private ministryKeyListItems$$ = new BehaviorSubject<MinistryKeyListItemResponse[]>([]);

  private readonly BASE_URL = '/api/ministry';

  constructor(private readonly http: HttpClient) {}

  ministryListItems$ = this.ministryListItems$$.asObservable();
  ministryKeyListItems$ = this.ministryKeyListItems$$.asObservable();

  createMinistry(ministry: MinistryRequest): Observable<MinistryListItemResponse> {
    return this.http
      .post<MinistryListItemResponse>(this.BASE_URL, ministry)
      .pipe(
        tap((ministryListItem) => this.ministryListItems$$.next([...this.ministryListItems$$.value, ministryListItem]))
      );
  }

  createMinistryKey(ministryID: number, key: MinistryKeyRequest): Observable<MinistryKeyListItemResponse> {
    const url = `${this.BASE_URL}/${ministryID}/keys`;
    return this.http.post<MinistryKeyListItemResponse>(url, key).pipe(
      tap((ministryKeyListItem) => console.log(ministryKeyListItem)),
      tap((ministryKey) => this.ministryKeyListItems$$.next([...this.ministryKeyListItems$$.value, ministryKey]))
    );
  }

  getMinistryListItems(ministryID?: number): Observable<MinistryListItemResponse[]> {
    const idParamPath = ministryID ? `/${ministryID}` : '';
    const url = `${this.BASE_URL}/list-item${idParamPath}`;

    return this.http
      .get<MinistryListItemResponse[]>(url)
      .pipe(tap((ministryListItems) => this.ministryListItems$$.next(ministryListItems)));
  }

  getScaleListItems(ministryID: number): Observable<ScaleListItemResponse[]> {
    const url = `${this.BASE_URL}/${ministryID}/scales`;
    return this.http.get<ScaleListItemResponse[]>(url);
  }

  getScaleListItemDetails(scaleID: number): Observable<ScaleDetailResponse> {
    const url = `${this.BASE_URL}/scales/${scaleID}`;
    return this.http.get<ScaleDetailResponse>(url);
  }

  getSongListItems(ministryID: number): Observable<SongListItemResponse[]> {
    const url = `${this.BASE_URL}/${ministryID}/songs`;
    return this.http.get<SongListItemResponse[]>(url);
  }

  getMemberListItems(ministryID: number, roles?: number[]): Observable<MemberListItemResponse[]> {
    const url = `${this.BASE_URL}/${ministryID}/members`;
    const params = new HttpParams().set('roles', roles ? roles.join(',') : '');

    return this.http.get<MemberListItemResponse[]>(url, { params });
  }

  getKeyListItem(ministryID: number): Observable<MinistryKeyListItemResponse[]> {
    const url = `${this.BASE_URL}/${ministryID}/keys`;
    return this.http
      .get<MinistryKeyListItemResponse[]>(url)
      .pipe(tap((ministryKeyListItems) => this.ministryKeyListItems$$.next(ministryKeyListItems)));
  }

  getKeys(): Observable<KeyResponse[]> {
    const url = `${this.BASE_URL}/keys`;
    return this.http.get<KeyResponse[]>(url);
  }
}
