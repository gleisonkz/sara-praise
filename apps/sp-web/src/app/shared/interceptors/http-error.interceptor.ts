import {
    HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpStatusCode
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { HotToastService } from '@ngneat/hot-toast';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private readonly toastService: HotToastService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error instanceof ErrorEvent) {
          this.toastService.error(error.error.message);
          return throwError(() => error.error.message);
        }

        switch (error.status) {
          case HttpStatusCode.BadRequest:
            this.toastService.error('Houve um erro ao realizar a operação. Por favor, tente novamente.');
            break;
          case HttpStatusCode.Unauthorized: {
            const message = error?.error?.message || 'Você não está autorizado a realizar esta operação.';
            this.toastService.error(message);
            break;
          }
          case HttpStatusCode.Forbidden:
            this.toastService.error('Você não tem permissão para realizar esta operação.');
            break;
          case HttpStatusCode.NotFound:
            this.toastService.error('Não foi possível encontrar o recurso solicitado.');
            break;
          case HttpStatusCode.MethodNotAllowed:
            this.toastService.error('Método de requisição não permitido.');
            break;
          case HttpStatusCode.GatewayTimeout:
            this.toastService.error('Erro no servidor, tempo de resposta excedido.');
            break;
          default:
            this.toastService.error('Houve um erro ao realizar a operação. Por favor, tente novamente.');
            break;
        }

        return throwError(() => error);
      })
    );
  }
}
