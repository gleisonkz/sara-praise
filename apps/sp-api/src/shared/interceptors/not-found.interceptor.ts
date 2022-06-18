import {
    CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor
} from '@nestjs/common';

import { Prisma } from '@prisma/client';
import { catchError, Observable } from 'rxjs';

export class DuplicatedKeyError extends Error {
  constructor(public readonly key: string) {
    super(`Já existe uma chave com o nome ${key}`);
  }
}

@Injectable()
export class DuplicatedKeyInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> | Promise<Observable<unknown>> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          const field = error?.meta['target'];
          throw new HttpException(`Já existe uma registro com o nome ${field}`, HttpStatus.BAD_REQUEST);
        } else {
          throw error;
        }
      })
    );
  }
}
