import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';

import { ENVIRONMENT } from 'apps/sp-web/src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export abstract class BaseApiService<T> {
  protected http: HttpClient;
  private readonly ENDPOINT = ENVIRONMENT.apiUrl;

  constructor(protected injector: Injector) {
    this.http = injector.get(HttpClient);
  }

  protected getAll(): Observable<T> {
    return this.http.get<T>(`${this.ENDPOINT}`);
  }

  protected postEntity<T>(obj: T): Observable<T> {
    return this.http.post<T>(this.ENDPOINT, obj);
  }

  protected putEntity(id: number, obj: T): Observable<T> {
    return this.http.put<T>(`${this.ENDPOINT}/${id}`, obj);
  }

  protected getEntity(id: number): Observable<T> {
    return this.http.get<T>(`${this.ENDPOINT}/${id}`);
  }

  protected deleteEntity(id: number): Observable<T> {
    return this.http.delete<T>(`${this.ENDPOINT}/${id}`);
  }
}
