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

  getArtists(ministryID: number): Observable<ArtistResponse[]> {
    const url = `${this.URL}/${ministryID}/artists`;
    return this.http.get<ArtistResponse[]>(url);
  }

  createArtist(ministryID: number, artist: ArtistRequest): Observable<ArtistResponse> {
    console.log({ ministryID, artist });
    const url = `${this.URL}/${ministryID}/artists`;
    return this.http.post<ArtistResponse>(url, artist);
  }
}
