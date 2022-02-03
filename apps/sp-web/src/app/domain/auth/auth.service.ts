import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { LocalStorageService } from '@sp/web/shared/services';

import { environment } from 'apps/sp-web/src/environments/environment';
import { Observable, of } from 'rxjs';

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

  login(username: string, password: string): Observable<boolean> {
    this.localStorageService.set('isLoggedIn', true);
    return of(true);
    // const url = environment.apiUrl + '/auth/sign-in';
    // return this.http.post(
    //   url,
    //   {
    //     username,
    //     password,
    //   },
    //   HTTP_OPTIONS
    // );
  }

  register(username: string, email: string, password: string): Observable<any> {
    const url = environment.apiUrl + '/auth/sign-up';

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
