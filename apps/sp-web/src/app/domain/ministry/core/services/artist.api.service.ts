import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ArtistRequest, ArtistResponse } from '@sp/shared-interfaces';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ArtistApiService {
  private readonly URL = '/api/ministries';

  constructor(private readonly http: HttpClient) {}

  create(ministryID: number, artist: ArtistRequest): Observable<ArtistResponse> {
    const url = `${this.URL}/${ministryID}/artists`;
    return this.http.post<ArtistResponse>(url, artist);
  }

  remove(ministryID: number, artistID: number): Observable<void> {
    const url = `${this.URL}/${ministryID}/artists/${artistID}`;
    return this.http.delete<void>(url);
  }

  update(ministryID: number, artistID: number, artistRequest: ArtistRequest) {
    const url = `${this.URL}/${ministryID}/artists/${artistID}`;
    return this.http.put<ArtistResponse>(url, artistRequest);
  }

  findAll(ministryID: number): Observable<ArtistResponse[]> {
    const url = `${this.URL}/${ministryID}/artists`;
    return this.http.get<ArtistResponse[]>(url);
  }

  findByID(artistID: number): Observable<ArtistResponse> {
    const url = `${this.URL}/artists/${artistID}`;
    return this.http.get<ArtistResponse>(url);
  }
}
