import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
    IMinisterSongKeyListItemResponse, IMinisterSongKeyRequest, IRoleResponse,
    MinistryListItemResponse, MinistryRequest, SongKeyResponse, SongListItemResponse
} from '@sp/shared-interfaces';

import { BaseApiService } from 'apps/sp-web/src/app/domain/ministry/core/services/base.api.service';
import { Observable } from 'rxjs';

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

  createMinisterSongKey(
    ministryID: number,
    ministerSongKeyRequest: IMinisterSongKeyRequest
  ): Observable<IMinisterSongKeyListItemResponse> {
    const url = `${this.URL}/${ministryID}/minister-song-key`;
    return this.http.post<IMinisterSongKeyListItemResponse>(url, ministerSongKeyRequest);
  }

  removeMinisterSongKey(ministryID: number, songID: number, memberID: number): Observable<void> {
    const url = `${this.URL}/${ministryID}/minister-song-key`;
    const params = new HttpParams().set('songID', songID.toString()).set('memberID', memberID.toString());
    return this.http.delete<void>(url, { params });
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

  getAvailableSongListItems(
    ministryID: number,
    ministerID: number,
    songID?: number
  ): Observable<SongListItemResponse[]> {
    const url = `${this.URL}/${ministryID}/songs/available/${ministerID}`;
    const params = new HttpParams().set('songID', songID ? songID.toString() : '');
    return this.http.get<SongListItemResponse[]>(url, { params });
  }

  getKeys(ministryID: number): Observable<SongKeyResponse[]> {
    const url = `${this.URL}/${ministryID}/keys`;
    return this.http.get<SongKeyResponse[]>(url);
  }
}
