import {
    HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpStatusCode
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { HotToastService } from '@ngneat/hot-toast';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private readonly router: Router, private readonly toastService: HotToastService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log({ error });
        if (error.error instanceof ErrorEvent) {
          this.toastService.error(error.error.message);
          return throwError(() => error.error.message);
        }

        switch (error.status) {
          case HttpStatusCode.BadRequest: {
            const message =
              error?.error?.message || 'Houve um erro ao realizar a operação. Por favor, tente novamente.';
            this.toastService.error(message);
            break;
          }
          case HttpStatusCode.Unauthorized: {
            const message = error?.error?.message || 'Você não está autenticado para realizar esta operação.';
            this.toastService.error(message);
            this.router.navigate(['/auth/sign-in']);
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
