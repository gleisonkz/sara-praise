import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Pagination, SongListItemResponse, SongRequest, SongResponse } from '@sp/shared-interfaces';

import { environment } from 'apps/sp-web/src/environments/environment.prod';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SongApiService {
  private readonly URL = `${environment.apiUrl}/ministries`;

  constructor(private readonly http: HttpClient) {}

  findAll(ministryID: number, pageSize: number, pageNumber: number): Observable<Pagination<SongListItemResponse>> {
    const url = `${this.URL}/${ministryID}/songs`;
    const params = new HttpParams().set('pageSize', pageSize.toString()).set('pageNumber', pageNumber.toString());
    return this.http.get<Pagination<SongListItemResponse>>(url, { params });
  }

  findByID(ministryID: number, songID: number): Observable<SongResponse> {
    const url = `${this.URL}/${ministryID}/songs/${songID}`;
    return this.http.get<SongResponse>(url);
  }

  create(ministryID: number, song: SongRequest): Observable<SongListItemResponse> {
    const url = `${this.URL}/${ministryID}/songs`;
    return this.http.post<SongListItemResponse>(url, song);
  }

  update(ministryID: number, songID: number, song: SongRequest): Observable<SongListItemResponse> {
    const url = `${this.URL}/${ministryID}/songs/${songID}`;
    return this.http.put<SongListItemResponse>(url, song);
  }

  delete(ministryID: number, songID: number): Observable<void> {
    const url = `${this.URL}/${ministryID}/songs/${songID}`;
    return this.http.delete<void>(url);
  }
}
