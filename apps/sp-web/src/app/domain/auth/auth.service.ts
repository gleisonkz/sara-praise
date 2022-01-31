import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'apps/sp-web/src/environments/environment';
import { Observable } from 'rxjs';

const HTTP_OPTIONS = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  isLoggedIn() {
    return true;
  }

  login(username: string, password: string): Observable<any> {
    const url = environment.apiUrl + '/auth/sign-in';
    return this.http.post(
      url,
      {
        username,
        password,
      },
      HTTP_OPTIONS
    );
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
