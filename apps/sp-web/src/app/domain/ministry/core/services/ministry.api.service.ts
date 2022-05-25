import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
    KeyResponse, MinistryKeyListItemResponse, MinistryKeyRequest, MinistryListItemResponse,
    MinistryRequest, RoleResponse, ScaleDetailResponse, ScaleListItemResponse, ScaleRequest,
    ScaleResponse, ScaleResponseCreate, SongListItemResponse
} from '@sp/shared-interfaces';

import { map, Observable, of } from 'rxjs';

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
    const mockedKeys: KeyResponse[] = [
      { keyID: 1, letter: 'C', name: 'Do Maior' },
      { keyID: 2, letter: 'Cm', name: 'Do Menor' },
      { keyID: 3, letter: 'C#', name: 'Do Sustenido Maior' },
      { keyID: 4, letter: 'C#m', name: 'Do Sustenido Menor' },
      { keyID: 5, letter: 'D', name: 'Re Maior' },
      { keyID: 6, letter: 'Dm', name: 'Re Menor' },
      { keyID: 7, letter: 'D#', name: 'Re Sustenido Maior' },
      { keyID: 8, letter: 'D#m', name: 'Re Sustenido Menor' },
      { keyID: 9, letter: 'E', name: 'Mi Maior' },
      { keyID: 10, letter: 'Em', name: 'Mi Menor' },
      { keyID: 11, letter: 'F', name: 'Fa Maior' },
      { keyID: 12, letter: 'Fm', name: 'Fa Menor' },
      { keyID: 13, letter: 'F#', name: 'Fa Sustenido Maior' },
      { keyID: 14, letter: 'F#m', name: 'Fa Sustenido Menor' },
      { keyID: 15, letter: 'G', name: 'Sol Maior' },
      { keyID: 16, letter: 'Gm', name: 'Sol Menor' },
      { keyID: 17, letter: 'G#', name: 'Sol Sustenido Maior' },
      { keyID: 18, letter: 'G#m', name: 'Sol Sustenido Menor' },
      { keyID: 19, letter: 'A', name: 'La Maior' },
      { keyID: 20, letter: 'Am', name: 'La Menor' },
      { keyID: 21, letter: 'A#', name: 'La Sustenido Maior' },
      { keyID: 22, letter: 'A#m', name: 'La Sustenido Menor' },
      { keyID: 23, letter: 'B', name: 'Si Maior' },
      { keyID: 24, letter: 'Bm', name: 'Si Menor' },
    ];

    return of(mockedKeys);

    const url = `${this.URL}/keys`;
    return this.http.get<KeyResponse[]>(url);
  }

  deleteScale(scaleID: number): Observable<ScaleResponse> {
    const url = `${this.URL}/scales/${scaleID}`;
    return this.http.delete<ScaleResponse>(url);
  }
}
