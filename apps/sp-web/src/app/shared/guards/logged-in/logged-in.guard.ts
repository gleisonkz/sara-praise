import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthService } from 'apps/sp-web/src/app/domain/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class IsLoggedInGuard implements CanActivate {
  constructor(private readonly router: Router, private readonly authService: AuthService) {}
  canActivate(): boolean {
    const isLoggedIn = this.authService.isLoggedIn;
    return isLoggedIn ? this.navigateToRoot() : true;
  }

  private navigateToRoot(): boolean {
    this.router.navigate(['/']);
    return false;
  }
}
