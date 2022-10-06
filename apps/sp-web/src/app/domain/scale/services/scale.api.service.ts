import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
    AvailableScaleSongResponse, eMinistryRole, IScaleResponse, MemberListItemResponse,
    MinisterSongRequest, ParticipantListItem, ParticipantRequest, ParticipantSelectItemResponse,
    ScaleDetailResponse, ScaleListItemResponse, ScaleRequest, ScaleSongRequest, ScaleSongResponse
} from '@sp/shared-interfaces';

import { BaseApiService } from 'apps/sp-web/src/app/domain/ministry/core/services/base.api.service';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScaleApiService extends BaseApiService {
  private readonly URL = '/api/ministries';

  constructor() {
    super('/ministries');
  }

  findAll(ministryID: number): Observable<ScaleListItemResponse[]> {
    const url = `${this.URL}/${ministryID}/scales`;
    return this.http.get<ScaleListItemResponse[]>(url);
  }

  findByID(ministryID: number, scaleID: number): Observable<ScaleDetailResponse> {
    const url = `${this.URL}/${ministryID}/scales/${scaleID}`;
    return this.http.get<ScaleDetailResponse>(url).pipe(
      map((scale) => {
        return {
          ...scale,
          date: new Date(scale.date),
        };
      })
    );
  }

  update(ministryID: number, scaleRequest: ScaleRequest, scaleID: number): Observable<IScaleResponse> {
    const url = `${this.URL}/${ministryID}/scales/${scaleID}`;
    return this.http.put<IScaleResponse>(url, scaleRequest);
  }

  create(ministryID: number, scale: ScaleRequest): Observable<IScaleResponse> {
    const url = `${this.URL}/${ministryID}/scales`;
    return this.http.post<IScaleResponse>(url, scale);
  }

  delete(ministryID: number, scaleID: number): Observable<boolean> {
    const url = `${this.URL}/${ministryID}/scales/${scaleID}`;
    return this.http.delete<boolean>(url);
  }

  getScaleListItemDetails(ministryID: number, scaleID: number): Observable<ScaleDetailResponse> {
    const url = `${this.URL}/${ministryID}/scales/${scaleID}`;
    return this.http.get<ScaleDetailResponse>(url);
  }

  createParticipant(ministryID: number, scaleID: number, participantRequest: ParticipantRequest): Observable<boolean> {
    const url = `${this.URL}/${ministryID}/scales/${scaleID}/participants`;
    return this.http.post<boolean>(url, participantRequest);
  }

  removeParticipant(ministryID: number, scaleID: number | undefined, participantID: number) {
    const url = `${this.URL}/${ministryID}/scales/${scaleID}/participants/${participantID}`;
    return this.http.delete(url);
  }

  findAllParticipants(ministryID: number, scaleID: number): Observable<MemberListItemResponse[]> {
    const url = `${this.URL}/${ministryID}/scales/${scaleID}/participants`;
    return this.http.get<MemberListItemResponse[]>(url);
  }

  findAllParticipantsByRoleID(
    ministryID: number,
    scaleID: number,
    roleID: eMinistryRole
  ): Observable<ParticipantSelectItemResponse[]> {
    const url = `${this.URL}/${ministryID}/scales/${scaleID}/participants-by-role`;

    const params = new HttpParams().set('roleID', roleID);
    return this.http.get<ParticipantSelectItemResponse[]>(url, { params });
  }

  upsertSongs(ministryID: number, scaleID: number, scaleSongRequest: ScaleSongRequest[]): Observable<boolean> {
    console.log('scaleSongRequest', scaleSongRequest);
    const url = `${this.URL}/${ministryID}/scales/${scaleID}/songs`;
    return this.http.post<boolean>(url, scaleSongRequest);
  }

  findAllSongs(ministryID: number, scaleID: number): Observable<ScaleSongResponse[]> {
    const url = `${this.URL}/${ministryID}/scales/${scaleID}/songs`;
    return this.http.get<ScaleSongResponse[]>(url);
  }

  findAvailableSongs(ministryID: number, scaleID: number): Observable<AvailableScaleSongResponse[]> {
    const url = `${this.URL}/${ministryID}/scales/${scaleID}/available-songs`;
    return this.http.get<AvailableScaleSongResponse[]>(url);
  }

  findAllParticipantListItems(ministryID: number, scaleID: number): Observable<ParticipantListItem[]> {
    const url = `${this.URL}/${ministryID}/scales/${scaleID}/participant-list-items`;
    return this.getWithRuntimeValidation<ParticipantListItem[]>(url, ParticipantListItem);
  }

  updateMinisterSong(
    ministryID: number,
    scaleID: number,
    songID: number,
    ministerSongRequest: MinisterSongRequest
  ): Observable<boolean> {
    const url = `${this.URL}/${ministryID}/scales/${scaleID}/songs/${songID}`;
    return this.http.put<boolean>(url, ministerSongRequest);
  }
}
