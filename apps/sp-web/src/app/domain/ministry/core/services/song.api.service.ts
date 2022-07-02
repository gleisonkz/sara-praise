import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { SongListItemResponse, SongRequest } from '@sp/shared-interfaces';

import { environment } from 'apps/sp-web/src/environments/environment.prod';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SongApiService {
  private readonly URL = `${environment.apiUrl}/ministries`;

  constructor(private readonly http: HttpClient) {}

  findAll(ministryID: number): Observable<SongListItemResponse[]> {
    const url = `${this.URL}/${ministryID}/songs`;
    return this.http.get<SongListItemResponse[]>(url);
  }

  create(ministryID: number, song: SongRequest): Observable<SongListItemResponse> {
    const url = `${this.URL}/${ministryID}/songs`;
    return this.http.post<SongListItemResponse>(url, song);
  }
}
