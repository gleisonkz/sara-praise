import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

import { HotToastService } from '@ngneat/hot-toast';
import { validate } from 'class-validator';
import { EMPTY, Observable, tap } from 'rxjs';

type Unpacked<T> = T extends Array<infer U> ? U : T;

export abstract class BaseApiService {
  private baseEndpoint = '/api';
  protected readonly http = inject(HttpClient);
  protected readonly toastService = inject(HotToastService);

  constructor(readonly segment: string) {
    this.baseEndpoint = `${this.baseEndpoint}/${segment}`;
  }

  protected getWithRuntimeValidation<T extends object>(url: string, ExpectedType: new () => Unpacked<T>) {
    return this.http.get<T>(url).pipe(
      tap((response) => {
        if (Array.isArray(response)) {
          response.forEach((item) => {
            const instance = new ExpectedType();
            Object.assign(instance, item);

            validate(instance)
              .then((errors) => {
                const hasErros = errors.length > 0;
                if (!hasErros) return EMPTY;

                this.toastService.error(`Erro com o objeto ${ExpectedType.name}`);
                console.error(errors);
                throw errors;
              })
              .catch(() => EMPTY);
          });
        } else {
          const instance = new ExpectedType();
          Object.assign(instance, response);

          validate(instance)
            .then((errors) => {
              this.toastService.error(`Erro com o objeto ${ExpectedType.name}`);
              console.error(errors);
              throw errors;
            })
            .catch(() => EMPTY);
        }
      })
    );
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
