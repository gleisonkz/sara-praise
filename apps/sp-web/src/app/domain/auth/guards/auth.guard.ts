import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment } from '@angular/router';

import { AuthService } from 'apps/sp-web/src/app/shared/services';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad {
  constructor(private readonly router: Router, private readonly authService: AuthService) {}

  canLoad(route: Route, segments: UrlSegment[]): boolean {
    const isLoggedIn = this.authService.isLoggedIn();
    if (isLoggedIn) return true;

    this.router.navigate(['/auth']);
    return false;
  }
}
