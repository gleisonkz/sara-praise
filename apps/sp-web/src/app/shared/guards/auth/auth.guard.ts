import { Injectable } from '@angular/core';
import { CanActivateChild, CanLoad, Router } from '@angular/router';

import { AuthService } from '../../../domain/auth/auth.service';

export const AUTH_REDIRECT_URL = '/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad, CanActivateChild {
  constructor(private readonly router: Router, private readonly authService: AuthService) {}

  canActivateChild(): boolean {
    return this.handleAuthentication();
  }

  canLoad(): boolean {
    return this.handleAuthentication();
  }

  private handleAuthentication(): boolean {
    const isLoggedIn = this.authService.isLoggedIn;
    if (isLoggedIn) return true;

    this.router.navigate([AUTH_REDIRECT_URL]);
    return false;
  }
}
