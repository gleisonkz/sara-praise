import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot, CanActivateChild, CanLoad, Route, Router, RouterStateSnapshot,
    UrlSegment
} from '@angular/router';

import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad, CanActivateChild {
  constructor(private readonly router: Router, private readonly authService: AuthService) {}
  canActivateChild(_: ActivatedRouteSnapshot, __: RouterStateSnapshot): boolean {
    const isLoggedIn = this.authService.isLoggedIn;
    if (isLoggedIn) return true;

    this.router.navigate(['/auth']);
    return false;
  }

  canLoad(route: Route, segments: UrlSegment[]): boolean {
    const isLoggedIn = this.authService.isLoggedIn;
    if (isLoggedIn) return true;

    this.router.navigate(['/auth']);
    return false;
  }
}
