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

  findAll(ministryID: number, roles?: number[]): Observable<MemberListItemResponse[]> {
    const url = `${this.URL}/${ministryID}/members`;
    const params = new HttpParams().set('roles', roles ? JSON.stringify(roles) : '');

    return this.http.get<MemberListItemResponse[]>(url, { params });
  }

  findByID(ministryID: number, memberID: number): Observable<MemberListItemResponse> {
    const url = `${this.URL}/${ministryID}/members/${memberID}`;
    return this.http.get<MemberListItemResponse>(url);
  }

  create(ministryID: number, member: MemberRequest): Observable<MemberListItemResponse> {
    const url = `${this.URL}/${ministryID}/members`;
    return this.http.post<MemberListItemResponse>(url, member);
  }

  remove(ministryID: number, memberID: number): Observable<void> {
    const url = `${this.URL}/${ministryID}/members/${memberID}`;
    return this.http.delete<void>(url);
  }

  update(ministryID: number, memberID: number, member: MemberRequest): Observable<MemberListItemResponse> {
    const url = `${this.URL}/${ministryID}/members/${memberID}`;
    return this.http.put<MemberListItemResponse>(url, member);
  }
}
