import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { SongListItemResponse, SongRequest, SongResponse } from '@sp/shared-interfaces';

import { environment } from 'apps/sp-web/src/environments/environment.prod';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SongApiService {
  private readonly URL = `${environment.apiUrl}/ministries`;

  constructor(private readonly http: HttpClient) {}

  getSongs(ministryID: number): Observable<SongListItemResponse[]> {
    const url = `${this.URL}/${ministryID}/songs`;
    return this.http.get<SongListItemResponse[]>(url);
  }

  createSong(ministryID: number, song: SongRequest): Observable<SongResponse> {
    console.log({ ministryID, song });
    const url = `${this.URL}/${ministryID}/songs`;

    return this.http.post<SongResponse>(url, song);
  }
}
