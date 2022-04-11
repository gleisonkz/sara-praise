import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { SignUpRequest, TokenResponse, UserAuthPayload } from '@sp/shared-interfaces';
import { LocalStorageService } from '@sp/web/shared/services';

import { JwtHelperService } from '@auth0/angular-jwt';
import { ENVIRONMENT } from 'apps/sp-web/src/environments/environment';
import { mapTo, Observable, tap } from 'rxjs';

const HTTP_OPTIONS = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

export const TOKEN_KEY = 'accessToken';

export const tokenGetter = () => {
  return localStorage.getItem(TOKEN_KEY);
};

const setToken = (source$: Observable<TokenResponse>) => {
  return source$.pipe(tap(({ accessToken }) => localStorage.setItem(TOKEN_KEY, accessToken)));
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private readonly jwtHelperService: JwtHelperService,
    private readonly localStorageService: LocalStorageService,
    private readonly http: HttpClient,
    private readonly router: Router
  ) {
    const windowRef = window as any;
    windowRef['AuthService'] = this;
  }

  user: UserAuthPayload;

  get isLoggedIn(): boolean {
    const token = this.localStorageService.get(TOKEN_KEY) || '';
    if (!token) return false;

    this.user = this.jwtHelperService.decodeToken(token);

    return !this.jwtHelperService.isTokenExpired(token);
  }

  signIn(email: string, password: string): Observable<boolean> {
    const url = ENVIRONMENT.apiUrl + '/auth/sign-in';
    return this.http.post<TokenResponse>(url, { email, password }).pipe(setToken, mapTo(true));
  }

  signUp(signUpRequest: SignUpRequest): Observable<boolean> {
    const url = ENVIRONMENT.apiUrl + '/auth/sign-up';
    return this.http.post<TokenResponse>(url, signUpRequest, HTTP_OPTIONS).pipe(setToken, mapTo(true));
  }

  logout() {
    this.localStorageService.remove(TOKEN_KEY);
    this.router.navigate(['/auth']);
  }
}
