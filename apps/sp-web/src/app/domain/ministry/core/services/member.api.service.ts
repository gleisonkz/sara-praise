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

  getMemberListItems(ministryID: number, roles?: number[]): Observable<MemberListItemResponse[]> {
    console.log('roles before', roles);

    const url = `${this.URL}/${ministryID}/members`;
    const params = new HttpParams().set('roles', roles ? JSON.stringify(roles) : '');

    console.log('roles after', params.get('roles'));

    return this.http.get<MemberListItemResponse[]>(url, { params });
  }

  createMember(ministryID: number, member: MemberRequest): Observable<MemberListItemResponse> {
    const url = `${this.URL}/${ministryID}/members`;
    return this.http.post<MemberListItemResponse>(url, member);
  }
}
