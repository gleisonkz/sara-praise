import { HttpClient } from '@angular/common/http';
import { Injector } from '@angular/core';

import { Observable } from 'rxjs';

export abstract class BaseApiService {
  protected http: HttpClient;
  private baseEndpoint = '/api';

  constructor(protected readonly injector: Injector, readonly segment: string) {
    this.http = injector.get(HttpClient);
    this.baseEndpoint = `${this.baseEndpoint}/${segment}`;
  }

  protected getAll<T>(): Observable<T> {
    return this.http.get<T>(`${this.baseEndpoint}`);
  }

  protected postEntity<T>(obj: T): Observable<T> {
    return this.http.post<T>(this.baseEndpoint, obj);
  }

  protected putEntity<T>(id: number, obj: T): Observable<T> {
    return this.http.put<T>(`${this.baseEndpoint}/${id}`, obj);
  }

  protected getEntity<T>(id: number): Observable<T> {
    return this.http.get<T>(`${this.baseEndpoint}/${id}`);
  }

  protected deleteEntity<T>(id: number, ...args: any): Observable<T> {
    return this.http.delete<T>(`${this.baseEndpoint}/${id}`, ...args);
  }
}
