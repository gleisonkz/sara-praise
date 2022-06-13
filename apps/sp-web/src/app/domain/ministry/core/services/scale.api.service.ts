import { Injectable } from '@angular/core';

import {
    IScaleResponse, ParticipantRequest, ScaleRequest, ScaleResponse
} from '@sp/shared-interfaces';

import { BaseApiService } from 'apps/sp-web/src/app/domain/ministry/core/services/base.api.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScaleApiService extends BaseApiService {
  private readonly URL = '/api/ministries';

  constructor() {
    super('/ministries');
  }

  findAll(ministryID: number): Observable<IScaleResponse[]> {
    const url = `${this.URL}/${ministryID}/scales`;

    return this.getWithRuntimeValidation<ScaleResponse[]>(url, ScaleResponse);
  }

  findAllSongListItems(ministryID: number, scaleID: number): Observable<any> {
    const url = `${this.URL}/${ministryID}/scales/${scaleID}/songs`;
    return of([]);
  }

  create(ministryID: number, scale: ScaleRequest): Observable<IScaleResponse> {
    const url = `${this.URL}/${ministryID}/scales`;
    return this.http.post<IScaleResponse>(url, scale);
  }

  createParticipant(ministryID: number, scaleID: number, participantRequest: ParticipantRequest): any {
    const url = `${this.URL}/${ministryID}/scales/${scaleID}/participants`;
    return this.http.post<any>(url, participantRequest);
  }
}
