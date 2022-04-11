import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
    KeyResponse, MinistryKeyListItemResponse, MinistryKeyRequest, MinistryListItemResponse,
    MinistryRequest, RoleResponse, ScaleDetailResponse, ScaleListItemResponse, ScaleRequest,
    ScaleResponse, ScaleResponseCreate, SongListItemResponse
} from '@sp/shared-interfaces';

import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MinistryApiService {
  private readonly URL = '/api/ministries';

  constructor(private readonly http: HttpClient) {}

  createMinistry(ministry: MinistryRequest): Observable<MinistryListItemResponse> {
    return this.http.post<MinistryListItemResponse>(this.URL, ministry);
  }

  deleteMinistry(ministryID: number) {
    const url = `${this.URL}/${ministryID}`;
    return this.http.delete(url);
  }

  createScale(ministryID: number, scaleRequest: ScaleRequest): Observable<ScaleResponseCreate> {
    const url = `${this.URL}/${ministryID}/scale`;
    return this.http.post<ScaleResponseCreate>(url, scaleRequest);
  }

  updateScale(scaleRequest: ScaleRequest, scaleID: number): Observable<ScaleResponse> {
    const url = `${this.URL}/scales/${scaleID}`;
    return this.http.put<ScaleResponse>(url, scaleRequest);
  }

  getRolesByMemberID(ministryID: number, memberID?: number) {
    const url = `${this.URL}/${ministryID}/roles`;
    const params = new HttpParams().set('memberID', memberID ? memberID.toString() : '');

    return this.http.get<RoleResponse[]>(url, { params });
  }

  getScaleByID(scaleID: number): Observable<ScaleResponse> {
    const url = `${this.URL}/scales/${scaleID}`;
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
    const url = `${this.URL}/${ministryID}/keys`;
    return this.http.post<MinistryKeyListItemResponse>(url, key);
  }

  getMinistryListItems(ministryID?: number): Observable<MinistryListItemResponse[]> {
    const idParamPath = ministryID ? `/${ministryID}` : '';
    const url = `${this.URL}/list-item${idParamPath}`;

    return this.http.get<MinistryListItemResponse[]>(url);
  }

  getScaleListItems(ministryID: number): Observable<ScaleListItemResponse[]> {
    const url = `${this.URL}/${ministryID}/scale-list-items`;
    return this.http.get<ScaleListItemResponse[]>(url);
  }

  getScaleListItemDetails(scaleID: number): Observable<ScaleDetailResponse> {
    const url = `${this.URL}/scale-details/${scaleID}`;
    return this.http.get<ScaleDetailResponse>(url);
  }

  getSongListItems(ministryID: number): Observable<SongListItemResponse[]> {
    const url = `${this.URL}/${ministryID}/songs`;
    return this.http.get<SongListItemResponse[]>(url);
  }

  getAvailableSongListItems(ministryID: number, ministerID: number): Observable<SongListItemResponse[]> {
    const url = `${this.URL}/${ministryID}/songs/available/${ministerID}`;
    return this.http.get<SongListItemResponse[]>(url);
  }

  getKeyListItem(ministryID: number): Observable<MinistryKeyListItemResponse[]> {
    const url = `${this.URL}/${ministryID}/keys`;
    return this.http.get<MinistryKeyListItemResponse[]>(url);
  }

  getKeys(): Observable<KeyResponse[]> {
    const url = `${this.URL}/keys`;
    return this.http.get<KeyResponse[]>(url);
  }

  deleteScale(scaleID: number): Observable<ScaleResponse> {
    const url = `${this.URL}/scales/${scaleID}`;
    return this.http.delete<ScaleResponse>(url);
  }
}
