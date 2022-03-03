import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { LocalStorageService } from '@sp/web/shared/services';

import { environment } from 'apps/sp-web/src/environments/environment';
import { mapTo, Observable, tap } from 'rxjs';

const HTTP_OPTIONS = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private readonly localStorageService: LocalStorageService, private http: HttpClient) {}

  isLoggedIn(): boolean {
    return this.localStorageService.get('isLoggedIn');
  }

  login(email: string, password: string): Observable<boolean> {
    const url = environment.apiUrl + '/auth/signin';

    return this.http.post<string>(url, { email, password }).pipe(
      tap((token) => {
        this.localStorageService.set('accessToken', token);
      }),
      mapTo(true)
    );
  }

  register(username: string, email: string, password: string): Observable<any> {
    const url = environment.apiUrl + '/auth/signup';

    return this.http.post(
      url,
      {
        username,
        email,
        password,
      },
      HTTP_OPTIONS
    );
  }
}
