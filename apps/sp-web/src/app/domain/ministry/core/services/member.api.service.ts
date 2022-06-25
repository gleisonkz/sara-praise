import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { MemberListItemResponse, MemberRequest } from '@sp/shared-interfaces';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MemberApiService {
  private readonly URL = '/api/ministries';

  constructor(private readonly http: HttpClient) {}

  create(ministryID: number, member: MemberRequest): Observable<MemberListItemResponse> {
    const url = `${this.URL}/${ministryID}/members`;
    return this.http.post<MemberListItemResponse>(url, member);
  }

  remove(ministryID: number, memberID: number): Observable<void> {
    const url = `${this.URL}/${ministryID}/members/${memberID}`;
    return this.http.delete<void>(url);
  }

  findAll(ministryID: number, roles?: number[]): Observable<MemberListItemResponse[]> {
    const url = `${this.URL}/${ministryID}/members`;
    const params = new HttpParams().set('roles', roles ? JSON.stringify(roles) : '');

    return this.http.get<MemberListItemResponse[]>(url, { params });
  }
}
