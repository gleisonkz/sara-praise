import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
    KeyResponse, MemberListItemResponse, MinistryKeyListItemResponse, MinistryKeyRequest,
    MinistryListItemResponse, MinistryRequest, ScaleDetailResponse, ScaleListItemResponse,
    ScaleRequest, ScaleResponse, ScaleResponseCreate, SongListItemResponse
} from '@sp/shared-interfaces';

import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MinistryService {
  private readonly BASE_URL = '/api/ministry';

  constructor(private readonly http: HttpClient) {}

  createMinistry(ministry: MinistryRequest): Observable<MinistryListItemResponse> {
    return this.http.post<MinistryListItemResponse>(this.BASE_URL, ministry);
  }

  createScale(ministryID: number, scaleRequest: ScaleRequest): Observable<ScaleResponseCreate> {
    const url = `${this.BASE_URL}/${ministryID}/scale`;
    return this.http.post<ScaleResponseCreate>(url, scaleRequest);
  }

  updateScale(scaleRequest: ScaleRequest, scaleID: number): Observable<ScaleResponse> {
    const url = `${this.BASE_URL}/scales/${scaleID}`;
    return this.http.put<ScaleResponse>(url, scaleRequest);
  }

  getScaleByID(scaleID: number): Observable<ScaleResponse> {
    const url = `${this.BASE_URL}/scales/${scaleID}`;
    return this.http.get<ScaleResponse>(url).pipe(
      map((scale) => {
        return {
          ...scale,
          date: new Date(scale.date),
        };
      })
    );
  }

  createMinistryKey(ministryID: number, key: MinistryKeyRequest): Observable<MinistryKeyListItemResponse> {
    const url = `${this.BASE_URL}/${ministryID}/keys`;
    return this.http.post<MinistryKeyListItemResponse>(url, key);
  }

  getMinistryListItems(ministryID?: number): Observable<MinistryListItemResponse[]> {
    const idParamPath = ministryID ? `/${ministryID}` : '';
    const url = `${this.BASE_URL}/list-item${idParamPath}`;

    return this.http.get<MinistryListItemResponse[]>(url);
  }

  getScaleListItems(ministryID: number): Observable<ScaleListItemResponse[]> {
    const url = `${this.BASE_URL}/${ministryID}/scale-list-items`;
    return this.http.get<ScaleListItemResponse[]>(url);
  }

  getScaleListItemDetails(scaleID: number): Observable<ScaleDetailResponse> {
    const url = `${this.BASE_URL}/scale-details/${scaleID}`;
    return this.http.get<ScaleDetailResponse>(url);
  }

  getSongListItems(ministryID: number): Observable<SongListItemResponse[]> {
    const url = `${this.BASE_URL}/${ministryID}/songs`;
    return this.http.get<SongListItemResponse[]>(url);
  }

  getAvailableSongListItems(ministryID: number, ministerID: number): Observable<SongListItemResponse[]> {
    const url = `${this.BASE_URL}/${ministryID}/songs/available/${ministerID}`;
    return this.http.get<SongListItemResponse[]>(url);
  }

  getMemberListItems(ministryID: number, roles?: number[]): Observable<MemberListItemResponse[]> {
    const url = `${this.BASE_URL}/${ministryID}/members`;
    const params = new HttpParams().set('roles', roles ? roles.join(',') : '');

    return this.http.get<MemberListItemResponse[]>(url, { params });
  }

  getKeyListItem(ministryID: number): Observable<MinistryKeyListItemResponse[]> {
    const url = `${this.BASE_URL}/${ministryID}/keys`;
    return this.http.get<MinistryKeyListItemResponse[]>(url);
  }

  getKeys(): Observable<KeyResponse[]> {
    const url = `${this.BASE_URL}/keys`;
    return this.http.get<KeyResponse[]>(url);
  }

  deleteScale(scaleID: number): Observable<ScaleResponse> {
    const url = `${this.BASE_URL}/scales/${scaleID}`;
    return this.http.delete<ScaleResponse>(url);
  }
}
