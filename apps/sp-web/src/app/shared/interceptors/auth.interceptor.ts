import {
    HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { TokenService } from 'apps/sp-web/src/app/shared/services';
import { Observable } from 'rxjs';

const TOKEN_HEADER_KEY = 'Authorization'; // for Spring Boot back-end

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private tokenService: TokenService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let authReq = req;
    const token = this.tokenService.getToken();

    if (!token) return next.handle(authReq);

    const authToken = `Bearer ${token}`;
    const headers = req.headers.set(TOKEN_HEADER_KEY, authToken);
    authReq = req.clone({ headers });

    return next.handle(authReq);
  }
}

export const AUTH_INTERCEPTOR_PROVIDERS = [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }];
