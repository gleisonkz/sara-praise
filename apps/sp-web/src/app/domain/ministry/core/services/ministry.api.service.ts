import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
    IMinisterSongKeyListItemResponse, IMinisterSongKeyRequest, IRoleResponse, KeyResponse,
    MinistryListItemResponse, MinistryRequest, SongListItemResponse
} from '@sp/shared-interfaces';

import { BaseApiService } from 'apps/sp-web/src/app/domain/ministry/core/services/base.api.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MinistryApiService extends BaseApiService {
  private readonly URL = '/api/ministries';

  constructor() {
    super('/ministries');
  }

  create(ministry: MinistryRequest): Observable<MinistryListItemResponse> {
    return this.http.post<MinistryListItemResponse>(this.URL, ministry);
  }

  delete(ministryID: number) {
    const url = `${this.URL}/${ministryID}`;
    return this.http.delete(url);
  }

  createMinisterSongKey(ministryID: number, ministerSongKeyRequest: IMinisterSongKeyRequest): Observable<boolean> {
    const url = `${this.URL}/${ministryID}/minister-song-key`;
    return this.http.post<boolean>(url, ministerSongKeyRequest);
  }

  removeMinisterSongKey(ministryID: number, songID: number, memberID: number) {
    const url = `${this.URL}/${ministryID}/minister-song-key`;
    const params = new HttpParams().set('songID', songID.toString()).set('memberID', memberID.toString());
    return this.http.delete(url, { params });
  }

  getMinisterSongKeys(ministryID: number): Observable<IMinisterSongKeyListItemResponse[]> {
    const url = `${this.URL}/${ministryID}/minister-song-key`;
    return this.http.get<IMinisterSongKeyListItemResponse[]>(url);
  }

  hasMinisterSongKey(ministryID: number, memberID: number, songID: number) {
    const url = `${this.URL}/${ministryID}/has-minister-song-key`;
    const params = new HttpParams().set('memberID', memberID.toString()).set('songID', songID.toString());

    return this.http.get<boolean>(url, { params });
  }

  getRolesByMemberID(ministryID: number, memberID?: number) {
    const url = `${this.URL}/${ministryID}/roles`;
    const params = new HttpParams().set('memberID', memberID ? memberID.toString() : '');

    return this.http.get<IRoleResponse[]>(url, { params });
  }

  createMinistryKey(ministryID: number, key: IMinisterSongKeyRequest): Observable<IMinisterSongKeyListItemResponse> {
    const url = `${this.URL}/${ministryID}/keys`;
    return this.http.post<IMinisterSongKeyListItemResponse>(url, key);
  }

  getMinistryListItems(ministryID?: number): Observable<MinistryListItemResponse[]> {
    const idParamPath = ministryID ? `/${ministryID}` : '';
    const url = `${this.URL}/list-item${idParamPath}`;

    return this.getWithRuntimeValidation<MinistryListItemResponse[]>(url, MinistryListItemResponse);
  }

  getSongListItems(ministryID: number): Observable<SongListItemResponse[]> {
    const url = `${this.URL}/${ministryID}/songs`;
    return this.http.get<SongListItemResponse[]>(url);
  }

  getAvailableSongListItems(
    ministryID: number,
    ministerID: number,
    songID?: number
  ): Observable<SongListItemResponse[]> {
    const url = `${this.URL}/${ministryID}/songs/available/${ministerID}`;
    const params = new HttpParams().set('songID', songID ? songID.toString() : '');
    return this.http.get<SongListItemResponse[]>(url, { params });
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
}
